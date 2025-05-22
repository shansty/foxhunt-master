package com.itechart.foxhunt.api.competition.service;

import com.itechart.foxhunt.api.competition.repository.CompetitionRepository;
import com.itechart.foxhunt.api.exception.NoSuitableRoleException;
import com.itechart.foxhunt.api.exception.UserNotFoundException;
import com.itechart.foxhunt.api.exception.WrongCoachException;
import com.itechart.foxhunt.api.exception.WrongCompetitionStatusException;
import com.itechart.foxhunt.api.exception.WrongFoxAmountException;
import com.itechart.foxhunt.api.exception.WrongIndexesException;
import com.itechart.foxhunt.api.exception.WrongPointException;
import com.itechart.foxhunt.api.exception.WrongStartDateException;
import com.itechart.foxhunt.api.competition.mapper.ModifyCompetitionMapper;
import com.itechart.foxhunt.api.user.dao.UserRepository;
import com.itechart.foxhunt.api.auth.security.LoggedUserService;
import com.itechart.foxhunt.api.competition.dto.FoxPoint;
import com.itechart.foxhunt.api.competition.dto.ModifyCompetition;
import com.itechart.foxhunt.api.competition.dto.Participant;
import com.itechart.foxhunt.domain.entity.CompetitionEntity;
import com.itechart.foxhunt.domain.entity.RoleEntity;
import com.itechart.foxhunt.domain.entity.UserEntity;
import com.itechart.foxhunt.domain.enums.CompetitionStatus;
import com.itechart.foxhunt.domain.enums.Role;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.Polygon;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.LongSummaryStatistics;
import java.util.Optional;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class CompetitionValidationServiceImpl implements CompetitionValidationService {

    private static final long DIFF_TIME_TO_START_COMPETITION = 15;   // in minutes

    private static final long DIFF_TIME_TO_SUBSCRIBE_TO_COMPETITION = 30;   // in minutes

    private final UserRepository userRepository;

    private final LoggedUserService loggedUserService;

    private final ModifyCompetitionMapper modifyCompetitionMapper;

    private final CompetitionRepository competitionRepository;

    @Override
    public void validateStartCompetition(CompetitionEntity competition, List<FoxPoint> foxPoints, List<Participant> participants) {

        validateCoach(competition);
        validateFoxAmount(competition, foxPoints);
        validatePointsInLocation(competition, foxPoints);

        validateCompetitionStatus(competition, CompetitionStatus.SCHEDULED, String.format(
            "You can't start a competition with id = %d if its status = %s", competition.getId(), competition.getStatus()));
        validateParticipants(participants);
    }

    @Override
    public void validateFinishCompetition(CompetitionEntity competition) {
        validateCompetitionStatus(competition, CompetitionStatus.RUNNING, String.format(
            "You can't finish a competition with id = %d if its status = %s", competition.getId(), competition.getStatus()));
    }

    @Override
    public void validateCancelCompetition(CompetitionEntity competition) {
        validateCompetitionStatus(competition, CompetitionStatus.SCHEDULED, String.format(
            "You can't cancel a competition with id = %d if its status = %s", competition.getId(), competition.getStatus()));
    }

    @Override
    public void validateSubscribeToCompetition(CompetitionEntity competition) {
        validateCompetitionStatus(competition, CompetitionStatus.SCHEDULED, String.format(
            "You can't subscribe to a competition with id = %d if its status = %s", competition.getId(), competition.getStatus()));
    }

    @Override
    public void validateCreateCompetition(Long organizationId, ModifyCompetition modifyCompetition) {
        boolean existsByOrganizationAndName = existsByOrganizationIdAndName(organizationId, modifyCompetition.getName());
        if (existsByOrganizationAndName) {
            log.error("Competition with name = {} already exists in organization with id = {}",
                modifyCompetition.getName(), organizationId);
            throw new IllegalArgumentException(String.format("Competition with name %s already exists", modifyCompetition.getName()));
        }

        validatePointsInLocation(modifyCompetitionMapper.domainToEntity(modifyCompetition), new ArrayList<>());

        UserEntity userEntity = userRepository.findById(modifyCompetition.getCoachId())
            .orElseThrow(() -> new UserNotFoundException("User doesn't exist"));
        validateUserHasRole(userEntity, Role.TRAINER, String.format(
            "Role of user with id = %d must be %s", userEntity.getId(), Role.TRAINER));
    }

    @Override
    public void validateUpdateCompetition(CompetitionEntity competitionEntity, ModifyCompetition modifyCompetition) {

        validatePointsInLocation(modifyCompetitionMapper.domainToEntity(modifyCompetition), new ArrayList<>());

        validateCompetitionStatus(competitionEntity, CompetitionStatus.SCHEDULED, String.format(
            "You can't update a competition with id = %d if its status = %s", competitionEntity.getId(), competitionEntity.getStatus()));
        UserEntity userEntity = userRepository.findById(modifyCompetition.getCoachId())
            .orElseThrow(() -> new UserNotFoundException("User doesn't exist"));
        validateUserHasRole(userEntity, Role.TRAINER, String.format(
            "Role of user with id = %d must %s", userEntity.getId(), Role.TRAINER));
    }

    private void validateDurationToStartDate(final CompetitionEntity competition, long diff, String errorMessage) {
        final Duration duration = Duration.between(LocalDateTime.now(), competition.getStartDate());
        // It can be negative as we allow to start competition with passed startDate
        if (duration.toMinutes() > diff) {
            throw new WrongStartDateException(errorMessage);
        }
    }

    private void validateCompetitionStatus(CompetitionEntity competition, CompetitionStatus status, String errorMessage) {
        if (competition.getStatus() != status) {
            throw new WrongCompetitionStatusException(errorMessage);
        }
    }

    private void validateUserHasRole(UserEntity userEntity, Role targetRole, String errorMessage) {
        final Optional<Role> anyRole = userEntity.getRoles().stream()
            .map(RoleEntity::getRole)
            .filter(role -> role == targetRole)
            .findAny();

        if (anyRole.isEmpty()) {
            throw new NoSuitableRoleException(errorMessage);
        }
    }

    private void validateParticipants(List<Participant> participants) {
        validateParticipantStartPositions(participants.stream().map(Participant::getStartPosition).collect(Collectors.toList()));
        validateUniquenessLong(participants.stream().map(Participant::getId).collect(Collectors.toList()),
            "Participant numbers shouldn't repeat");
        validateUniquenessInteger(participants.stream().map(Participant::getParticipantNumber).collect(Collectors.toList()),
            "User ids shouldn't repeat");
        validateUsersRolesByIds(participants.stream().map(Participant::getId).collect(Collectors.toList()));
    }

    private void validateUniquenessLong(List<Long> ids, String errorMessage) {
        long size = ids.stream().distinct().count();
        if (size != ids.size()) {
            throw new WrongIndexesException(errorMessage);
        }
    }

    private void validateUniquenessInteger(List<Integer> ids, String errorMessage) {
        long size = ids.stream().distinct().count();
        if (size != ids.size()) {
            throw new WrongIndexesException(errorMessage);
        }
    }

    private void validateUsersRolesByIds(List<Long> userIds) {
        List<Long> participantIds = userRepository.findByIdsAndRole(userIds, Role.PARTICIPANT);
        List<Long> buffer = new ArrayList<>(userIds);
        buffer.removeAll(participantIds);
        if (!buffer.isEmpty()) {
            throw new UserNotFoundException(String.format("No users in DB with role PARTICIPANT and ids = %s", buffer));
        }
    }

    private void validateParticipantStartPositions(List<Long> startPositions) {
        LongSummaryStatistics summaryStatistics = startPositions.stream().distinct().mapToLong(x -> x).summaryStatistics();
        boolean valid = summaryStatistics.getMax() == (startPositions.size() / 2 + startPositions.size() % 2) &&
            summaryStatistics.getCount() == (startPositions.size() / 2 + startPositions.size() % 2);
        if (!valid) {
            throw new WrongIndexesException("Participant numbers should be: 1, 1, 2, 2, 3 ...");
        }
        // Check that unique index is the last one (if exist)
        if (startPositions.size() % 2 != 0) {
            long countMaxElement = startPositions.stream().filter(x -> x.equals(summaryStatistics.getMax())).count();
            if (countMaxElement != 1) {
                throw new WrongIndexesException("Single participant should start last");
            }
        }
    }

    private void validateCoach(CompetitionEntity competition) {
        if (!competition.getCoach().getId().equals(loggedUserService.getLoggedUserEntity().getId())) {
            throw new WrongCoachException("Only assigned to competition coach could start competition");
        }
    }

    private void validatePointsInLocation(CompetitionEntity competitionEntity, List<FoxPoint> foxPoints) {

        Polygon competitionArea = competitionEntity.getLocation().getCoordinates();

        List<Point> allPoints = new ArrayList<>();
        allPoints.add(competitionEntity.getStartPoint());
        allPoints.add(competitionEntity.getFinishPoint());

        if (foxPoints != null) {
            foxPoints.forEach(foxPoint -> allPoints.add(foxPoint.getCoordinates()));
        }
        for (Point point : allPoints) {
            if (!competitionArea.contains(point)) {
                throw new WrongPointException();
            }
        }
    }

    private void validateFoxAmount(CompetitionEntity competitionEntity, List<FoxPoint> foxPoints) {

        if (competitionEntity.getFoxAmount() != foxPoints.size()) {
            throw new WrongFoxAmountException();
        }

    }

    private boolean existsByOrganizationIdAndName(Long organizationId, String name) {
        return competitionRepository.existsByOrganizationAndName(organizationId, name);
    }

}
