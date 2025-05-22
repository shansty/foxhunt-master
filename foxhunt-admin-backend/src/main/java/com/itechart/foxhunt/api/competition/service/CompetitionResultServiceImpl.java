package com.itechart.foxhunt.api.competition.service;

import com.itechart.foxhunt.api.competition.repository.CompetitionParticipantRepository;
import com.itechart.foxhunt.api.competition.repository.CompetitionRepository;
import com.itechart.foxhunt.api.competition.repository.CompetitionResultRepository;
import com.itechart.foxhunt.api.exception.CompetitionException;
import com.itechart.foxhunt.api.exception.NoActiveCompetitionException;
import com.itechart.foxhunt.api.competition.mapper.FoxPointMapper;
import com.itechart.foxhunt.api.user.mapper.UserMapper;
import com.itechart.foxhunt.api.competition.dto.CompetitionResult;
import com.itechart.foxhunt.api.competition.dto.FoxPoint;
import com.itechart.foxhunt.api.user.dto.UserResult;
import com.itechart.foxhunt.api.competition.dto.ActiveTracker;
import com.itechart.foxhunt.domain.entity.*;
import org.locationtech.jts.geom.Point;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CompetitionResultServiceImpl implements CompetitionResultService {

    private static final int COMPETITION_DURATION_WITHOUT_USERS = 3 * 60 * 60;

    //The number of minutes after which the auto finish will start working
    private static final int COMPETITION_AUTO_FINISH_FREEZE_TIME_MIN = 5;

    private static final String ERROR_MSG_COMPETITION_ALREADY_FINISHED = "Competition with id %s already finished";

    @Value("${rabbitmq.queue.result.routing.key}")
    private String resultsQueueRoutingKey;

    private final PointVisitService pointVisitService;

    private final CompetitionParticipantRepository competitionParticipantRepository;

    private final CompetitionResultRepository competitionResultRepository;

    private final FoxPointMapper foxPointMapper;

    private final UserMapper userMapper;

    @Autowired(required = false)
    private RabbitTemplate rabbitTemplate;

    private final CompetitionRepository competitionRepository;

    @Override
    @Transactional
    public FoxPoint updateCompetitionResults(ActiveTracker activeTracker) {

        FoxPointEntity foxPointEntity = pointVisitService.findVisitedFoxPoint(activeTracker);

        if (foxPointEntity.getId() == null) {
            return null;
        }

        updateResultsAndSendMessage(foxPointEntity, activeTracker.getCompetitionId(), activeTracker.getParticipantId());

        return foxPointMapper.entityToDomain(foxPointEntity);
    }

    private void updateResultsAndSendMessage(FoxPointEntity foxPointEntity, Long competitionId, Long userId) {
        updateResults(foxPointEntity, competitionId, userId);
        sendUpdatedResultsToQueue(competitionId);
    }

    private void updateResults(FoxPointEntity foxPointEntity, Long competitionId, Long userId) {
        CompetitionParticipantEntity competitionParticipant = getCompetitionParticipant(competitionId, userId);

        CompetitionResultEntity competitionResultEntity = CompetitionResultEntity.builder()
            .competitionParticipant(competitionParticipant)
            .foxPoint(foxPointEntity)
            .visitDate(LocalDateTime.now())
            .build();

        competitionResultRepository.save(competitionResultEntity);
    }

    @Override
    @Transactional
    public void participantFinish(ActiveTracker activeTracker) {
        final CompetitionParticipantEntity competitionParticipant = getCompetitionParticipant(
            activeTracker.getCompetitionId(), activeTracker.getParticipantId());

        if (competitionParticipant.getFinishDate() != null) {
            throw new CompetitionException(String.format(ERROR_MSG_COMPETITION_ALREADY_FINISHED,
                competitionParticipant.getId().getCompetitionId()));
        }

        final boolean completed = isParticipantCompleteCompetition(competitionParticipant,
            activeTracker.getCurrentLocation());

        competitionParticipant.setCompleted(completed);
        competitionParticipant.setFinishDate(LocalDateTime.now());

        sendUpdatedResultsToQueue(activeTracker.getCompetitionId());
    }

    @Override
    @Transactional
    public Set<Long> participantFinishWhenExpired(CompetitionEntity competitionEntity) {
        final Set<CompetitionParticipantEntity> competitionParticipants = competitionParticipantRepository
            .findByCompetitionIdAndFinishDateIsNull(competitionEntity.getId());
        final Set<Long> participantIds = new HashSet<>();
        competitionParticipants.forEach(competitionParticipant -> {
            // the difference must exceed 3 hours + 1 fox duration to make a participant
            // finish the game if he/she has not done it yet.
            final long diff = ChronoUnit.SECONDS.between(competitionParticipant.getStartDate(), LocalDateTime.now());
            if (competitionParticipant.getFinishDate() == null
                && diff >= competitionEntity.getFoxDuration() + COMPETITION_DURATION_WITHOUT_USERS) {
                competitionParticipant.setFinishDate(LocalDateTime.now());
                participantIds.add(competitionParticipant.getUser().getId());
            }
        });
        return participantIds;
    }

    /**
     * @param competitionParticipant participant which should be checked
     * @param participantLocation    current participant location
     * @return boolean value which represents that participant has completed full competition
     */
    private boolean isParticipantCompleteCompetition(CompetitionParticipantEntity competitionParticipant,
                                                     Point participantLocation) {

        return competitionParticipant.getCompetitionResult().size() == competitionParticipant
            .getCompetition().getFoxAmount()
            && pointVisitService.isPointVisited(competitionParticipant.getCompetition().getFinishPoint(),
            participantLocation);
    }

    /**
     * generate sorted list with users game result
     *
     * @param competitionId Long competition id
     * @return List of  {@link UserResult}
     */
    @Transactional
    @Override
    public List<UserResult> getUsersResult(Long competitionId) {

        final List<UserResult> resultList =
            competitionParticipantRepository.findByCompetitionId(competitionId)
                .stream()
                .map(e -> UserResult.builder()
                    .user(userMapper.entityToDomain(e.getUser()))
                    .startPosition(e.getStartPosition())
                    .foundFoxes(e.getCompetitionResult().size())
                    .startDate(e.getStartDate())
                    .finishDate(e.getFinishDate())
                    .completeCompetition(e.isCompleted())
                    .build())
                .sorted(UserResult::compareByCompetitionResult)
                .collect(Collectors.toList());

        addCurrentPositionToUserResultList(resultList);
        return resultList;
    }

    @Override
    public boolean isUserVisitFinishPoint(ActiveTracker activeTracker) {

        final boolean isStartFreezeTimeNotExpired = getCompetitionParticipant(activeTracker.getCompetitionId(),
            activeTracker.getParticipantId())
            .getStartDate().plusMinutes(COMPETITION_AUTO_FINISH_FREEZE_TIME_MIN).isAfter(LocalDateTime.now());

        if (isStartFreezeTimeNotExpired) {
            return false;
        }

        final Point finishPoint = competitionRepository.findById(activeTracker.getCompetitionId())
            .orElseThrow().getFinishPoint();

        return pointVisitService.isPointVisited(finishPoint, activeTracker.getCurrentLocation());
    }

    @Override
    public boolean isUserOutsidePolygon(ActiveTracker activeTracker) {
        return !competitionRepository
            .findById(activeTracker.getCompetitionId())
            .orElseThrow(() -> {
                log.warn("Competition with id: {} doesn't exist", activeTracker.getCompetitionId());
                throw new EntityNotFoundException(
                    "Competition with id: " + activeTracker.getCompetitionId() + " doesn't exist");
            })
            .getLocation()
            .getCoordinates()
            .contains(activeTracker.getCurrentLocation());
    }

    private void sendUpdatedResultsToQueue(Long competitionId) {
        List<UserResult> results = getUsersResult(competitionId);
        if (rabbitTemplate != null) {
            rabbitTemplate.convertAndSend(resultsQueueRoutingKey,
                CompetitionResult.builder().competitionId(competitionId).userResultList(results).build());
        }
    }

    private CompetitionParticipantEntity getCompetitionParticipant(Long competitionId, Long userId) {
        CompetitionParticipantId id = new CompetitionParticipantId(competitionId, userId);

        return competitionParticipantRepository.findById(id).orElseThrow(NoActiveCompetitionException::new);
    }

    /**
     * added current position to UserResult userResults should be sorted according
     * {@link UserResult#compareByCompetitionResult(UserResult)}
     *
     * if participants finished but not complete competition (e.g not visit finish
     * point) and caught same quantity of foxes they should have same position. In
     * this case game time no matter
     *
     * @param userResults list of {@link UserResult}
     */

    private void addCurrentPositionToUserResultList(List<UserResult> userResults) {

        if (userResults.isEmpty()) {
            return;
        }

        userResults.get(0).setCurrentPosition(1);

        for (int i = 1; i < userResults.size(); i++) {

            if (userResults.get(i - 1).compareByFoxes(userResults.get(i)) == 0
                && userResults.get(i - 1).compareByCompetitionCompleteStatus(userResults.get(i)) == 0
                && !userResults.get(i - 1).isCompletedOrInGame()) {

                userResults.get(i).setCurrentPosition(userResults.get(i - 1).getCurrentPosition());

            } else {
                userResults.get(i).setCurrentPosition(userResults.get(i - 1).getCurrentPosition() + 1);
            }
        }
    }
}
