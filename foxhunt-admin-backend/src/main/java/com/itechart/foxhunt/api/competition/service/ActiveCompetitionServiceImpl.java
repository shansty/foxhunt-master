package com.itechart.foxhunt.api.competition.service;

import com.itechart.foxhunt.api.competition.CompetitionUtils;
import com.itechart.foxhunt.api.competition.dto.*;
import com.itechart.foxhunt.api.competition.job.ActiveCompetitionJob;
import com.itechart.foxhunt.api.competition.mapper.CompetitionMapper;
import com.itechart.foxhunt.api.competition.mapper.FoxPointMapper;
import com.itechart.foxhunt.api.competition.repository.CompetitionParticipantRepository;
import com.itechart.foxhunt.api.competition.repository.CompetitionRepository;
import com.itechart.foxhunt.api.config.RabbitConfig;
import com.itechart.foxhunt.api.exception.NoActiveCompetitionException;
import com.itechart.foxhunt.api.user.service.UserService;
import com.itechart.foxhunt.domain.entity.CompetitionEntity;
import com.itechart.foxhunt.domain.entity.CompetitionParticipantEntity;
import com.itechart.foxhunt.domain.entity.UserEntity;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import javax.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ScheduledFuture;
import java.util.stream.Collectors;

import static com.itechart.foxhunt.domain.enums.CompetitionStatus.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class ActiveCompetitionServiceImpl implements ActiveCompetitionService {

    private static final String HALTED_FOR_NO_REASON = "The competition was halted for no reason";

    private static final String COMPETITION_EXPIRED_STOPPING_REASON = "Competition time expired";

    private static final long SECONDS_TO_MILLISECONDS_CONVERSION = 1000;

    // Using competitionId as a key for every activeCompetitionJob
    private final Map<Long, ActiveCompetitionJob> activeCompetitions = new HashMap<>();

    // Using competitionId as a key for every scheduledFuture to be able to stop job
    private final Map<Long, ScheduledFuture> scheduledFutures = new HashMap<>();

    private final ThreadPoolTaskScheduler threadPoolTaskScheduler;

    private final CompetitionValidationService competitionValidationService;

    private final CompetitionService competitionService;

    private final UserService userService;

    private final CompetitionRepository competitionRepository;

    private final CompetitionParticipantRepository participantRepository;

    private final CompetitionMapper competitionMapper;

    private final FoxPointMapper foxPointMapper;

    private final CompetitionResultService competitionResultService;

    private final CompetitionEmulatorService emulatorService;

    private final Map<Long, AbstractMap.SimpleEntry<Long, SseEmitter>> allSubscriptions = new HashMap<>();

    @Override
    public void subscribeToCompetition(final Long competitionId, final SseEmitter client,
                                       final UserEntity subscriber, final Long organizationId) {
        // Check if this competition is initialized
        if (!activeCompetitions.containsKey(competitionId)) {
            CompetitionEntity competitionEntity = competitionService.findById(competitionId, organizationId);
            competitionValidationService.validateSubscribeToCompetition(competitionEntity);
            createActiveCompetitionJob(competitionEntity);
        }
        ActiveCompetitionJob activeCompetitionJob = activeCompetitions.get(competitionId);

        // Subscribe for notifications
        activeCompetitionJob.addClient(client, subscriber);
        allSubscriptions.put(subscriber.getId(), new AbstractMap.SimpleEntry<>(competitionId, client));

        client.onCompletion(() -> activeCompetitionJob.removeClient(client));
        client.onTimeout(() -> activeCompetitionJob.removeClient(client));
    }

    @Override
    @Transactional
    public Competition startById(final Long id, final List<FoxPoint> foxPoints,
                                 List<Participant> participants, final Long organizationId) {
        final CompetitionEntity competitionEntity = competitionService.findById(id, organizationId);
        competitionValidationService
            .validateStartCompetition(competitionEntity, foxPoints, participants);

        competitionEntity.setStatus(RUNNING);
        competitionEntity.setFoxPointList(foxPointMapper.domainListToEntityList(foxPoints));
        competitionEntity.setActualStartDate(LocalDateTime.now());
        competitionEntity
            .setExpectedCompetitionDuration(CompetitionUtils.secondsToHHMMSS(competitionEntity));

        setupCompetitionParticipantsData(competitionEntity, participants);

        Competition startedCompetition = competitionMapper.entityToDomain(competitionRepository.save(competitionEntity));
        if (competitionEntity.getIsEmulated()) {
            startCompetitionEmulation(startedCompetition);
        }
        startNotifications(competitionEntity); // Start sending notifications to subscribers
        return startedCompetition;
    }

    private void setupCompetitionParticipantsData(CompetitionEntity competitionEntity,
                                                  List<Participant> participantsSetupData) {
        Map<Long, CompetitionParticipantEntity> participantsByUserId = competitionEntity.getParticipants().stream()
            .collect(Collectors.toMap(
                participant -> participant.getId().getUserId(),
                participant -> participant));

        List<CompetitionParticipantEntity> participantsToUpdate = participantsSetupData.stream().map(setupData -> {
            LocalDateTime startDate = LocalDateTime.now()
                .plusSeconds(competitionEntity.getFoxDuration() * setupData.getStartPosition() - 1);
            CompetitionParticipantEntity participantToUpdate = participantsByUserId.get(setupData.getId());
            participantToUpdate.setParticipantNumber(setupData.getParticipantNumber());
            participantToUpdate.setStartPosition(setupData.getStartPosition());
            participantToUpdate.setStartDate(startDate);
            participantToUpdate.setColor(setupData.getColor());
            return participantToUpdate;
        }).toList();

        participantRepository.saveAll(participantsToUpdate);
    }

    @Override
    public Competition finishById(final Long id, final String reasonToStop,
                                  final Long organizationId) {
        final CompetitionEntity competitionEntity = competitionService.findById(id, organizationId);

        return finishCompetition(competitionEntity, reasonToStop);
    }

    @Override
    public Competition cancelById(Long id, final Long organizationId) {
        final CompetitionEntity competitionEntity = competitionService.findById(id, organizationId);
        competitionValidationService.validateCancelCompetition(competitionEntity);

        competitionEntity.setStatus(CANCELED);
        return competitionMapper.entityToDomain(competitionRepository.save(competitionEntity));
    }

    @Override
    public ActiveFoxInfo getActiveFoxInfo(final Long competitionId) {
        ActiveCompetitionJob activeCompetitionJob = activeCompetitions.get(competitionId);

        isActiveCompetitionJobNull(competitionId, activeCompetitionJob);

        return activeCompetitionJob.getActiveFoxInfo();
    }

    @Override
    public ActiveCompetition getActiveCompetitionInfo(final Long competitionId) {
        ActiveCompetitionJob activeCompetitionJob = activeCompetitions.get(competitionId);

        isActiveCompetitionJobNull(competitionId, activeCompetitionJob);

        return activeCompetitionJob.getActiveCompetitionInfo();
    }

    /**
     * restore the state for competitions that have no related jobs, i.e. after launch If
     * competition not expired related jobs will be run otherwise competition will be finished
     *
     * @return ids for competitions that was restored
     */
    @Override
    @Transactional
    public List<Long> restoreCompetitionStateForRunningCompetitions() {
        final List<CompetitionEntity> allRunningCompetitions =
            competitionRepository.getAllByStatus(RUNNING);

        final List<Long> restoredIds = new ArrayList<>();

        allRunningCompetitions
            .stream().filter(competition -> !activeCompetitions.containsKey(competition.getId()))
            .forEach(competition -> {
                if (isCompetitionExpired(competition)) {
                    finishCompetition(competition, HALTED_FOR_NO_REASON);
                } else {
                    startNotifications(competition);
                    restoredIds.add(competition.getId());
                }
            });

        return restoredIds;
    }

    @Override
    public void completeCurrentEmitter(UserEntity subscriber) {
        AbstractMap.SimpleEntry<Long, SseEmitter> subscription = allSubscriptions.get(subscriber.getId());
        Optional.ofNullable(subscription).ifPresent(entry -> {
            entry.getValue().complete();
            allSubscriptions.remove(subscriber.getId());
            log.info("Subscription on competition with id {} of user with id {} was successfully completed", entry.getKey(), subscriber.getId());
        });
    }

    @Override
    public void finishExpiredCompetitions() {
        final List<CompetitionEntity> allRunningCompetitions =
            competitionRepository.getAllByStatus(RUNNING);

        allRunningCompetitions
            .stream()
            .filter(this::isCompetitionExpired)
            .forEach(competition -> finishCompetition(competition, COMPETITION_EXPIRED_STOPPING_REASON));
    }

    @RabbitListener(queues = RabbitConfig.RESULT_QUEUE_NAME)
    public void sendResultToSubscribers(CompetitionResult competitionResult) {

        if (competitionResult == null || competitionResult.getCompetitionId() == null) {
            return;
        }

        ActiveCompetitionJob activeCompetitionJob = activeCompetitions
            .get(competitionResult.getCompetitionId());

        if (activeCompetitionJob == null) {
            return;
        }

        activeCompetitionJob.sendResultToSubscribers(competitionResult);

    }

    @Override
    public List<Competition> getActiveCompetitions(final Long userId, final Long organizationId) {
        List<CompetitionEntity> allRunningCompetitions =
            competitionRepository.getAllByStatus(RUNNING)
                .stream()
                .filter(competition ->
                    isUserParticipantOfCompetition(userId, competition) &&
                        Objects
                            .nonNull(competitionService.findById(competition.getId(), organizationId)))
                .collect(Collectors.toList());
        return allRunningCompetitions
            .stream()
            .map(competitionMapper::entityToDomain)
            .collect(Collectors.toList());
    }

    @Override
    public Competition getActiveCompetitionById(
        final Long userId,
        final Long organizationId,
        final Long competitionId) {
        CompetitionEntity competitionEntity = competitionRepository
            .findByIdAndOrganizationIdAndStatus(competitionId,
                organizationId, RUNNING).orElseThrow(() -> {
                log.warn("Running competition with id: {} not found", userId);
                throw new EntityNotFoundException(
                    "Running competition with id: " + competitionId + " not found");
            });
        if (isUserParticipantOfCompetition(userId, competitionEntity)) {
            return competitionMapper.entityToDomain(competitionEntity);
        } else {
            log.warn("User with id {} is not participant of competition with id: {} not found", userId,
                organizationId);
            throw new EntityNotFoundException(
                "User with id" + userId + " is not participant of competition with id:" + competitionId
                    + " not found");
        }
    }

    private void startNotifications(final CompetitionEntity competition) {
        // Check if this competition is initialized
        if (!activeCompetitions.containsKey(competition.getId())) {
            createActiveCompetitionJob(competition);
        }
        ActiveCompetitionJob activeCompetitionJob = activeCompetitions.get(competition.getId());
        activeCompetitionJob
            .initializeCompetition(competition);   // Refresh Competition object with new status

        // Start sending notifications (active fox) to all subscribers
        ScheduledFuture<?> scheduledFuture = threadPoolTaskScheduler
            .scheduleAtFixedRate(activeCompetitionJob,
                competition.getFoxDuration() * SECONDS_TO_MILLISECONDS_CONVERSION);
        // Saving scheduledFuture to have possibility to stop job
        scheduledFutures.put(competition.getId(), scheduledFuture);

    }

    private Competition finishCompetition(final CompetitionEntity competitionEntity,
                                          final String reasonToStop) {
        competitionValidationService.validateFinishCompetition(competitionEntity);

        ActiveCompetitionJob activeCompetitionJob = activeCompetitions
            .get(competitionEntity.getId());

        if (activeCompetitionJob != null) {
            competitionEntity.setClosingActiveFox(activeCompetitionJob.getActiveFoxIdx());
        }

        competitionEntity
            .setStoppingReason(reasonToStop != null ? reasonToStop : HALTED_FOR_NO_REASON);

        competitionEntity.setActualFinishDate(LocalDateTime.now());
        competitionEntity.setStatus(FINISHED);
        finishNotifications(competitionEntity);

        if (competitionEntity.getIsEmulated()) {
            emulatorService.finishCompetitionEmulation(competitionEntity.getId());
        }

        return competitionMapper.entityToDomain(competitionRepository.save(competitionEntity));
    }

    private void finishNotifications(final CompetitionEntity competition) {
        ScheduledFuture<?> scheduledFuture = scheduledFutures.remove(competition.getId());

        if (scheduledFuture == null) {
            return;
        }

        // Stop scheduling active Foxes
        scheduledFuture.cancel(true);

        ActiveCompetitionJob activeCompetitionJob = activeCompetitions.remove(competition.getId());
        // Delete all subscribers from activeJob
        activeCompetitionJob.finishCompetition();
    }

    private void createActiveCompetitionJob(final CompetitionEntity competition) {
        activeCompetitions.put(competition.getId(),
            new ActiveCompetitionJob(competition, threadPoolTaskScheduler,
                competitionResultService));
    }

    private void isActiveCompetitionJobNull(final Long competitionId,
                                            ActiveCompetitionJob activeCompetitionJob) {
        if (activeCompetitionJob == null) {
            throw new NoActiveCompetitionException(
                String.format("No active competitions with id %s", competitionId.toString()));
        }
    }

    private boolean isCompetitionExpired(CompetitionEntity competition) {
        return competition
            .getActualStartDate()
            .plusSeconds(CompetitionUtils.competitionDuration(competition))
            .isBefore(LocalDateTime.now());
    }

    private boolean isUserParticipantOfCompetition(Long userId, CompetitionEntity competition) {
        return Objects.nonNull(competition.getParticipants().stream()
            .filter(competitionParticipantEntity -> competitionParticipantEntity
                .getId().getUserId().equals(userId)).findFirst().orElse(null));
    }

    private CompletableFuture<Void> startCompetitionEmulation(Competition competition) {
        CompletableFuture<Void> emulationFuture = emulatorService.emulateCompetition(competition);
        emulationFuture.whenComplete((result, ex) -> {
            if (ex != null) {
                log.error("Competition emulation error has occurred, cause -> {}", ex.getLocalizedMessage());
                emulatorService.finishCompetitionEmulation(competition.getId());
            }
        });
        return emulationFuture;
    }
}
