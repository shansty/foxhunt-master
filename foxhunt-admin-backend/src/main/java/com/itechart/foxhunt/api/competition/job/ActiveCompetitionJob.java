package com.itechart.foxhunt.api.competition.job;

import com.itechart.foxhunt.api.competition.dto.*;
import com.itechart.foxhunt.api.competition.service.CompetitionResultService;
import com.itechart.foxhunt.api.competition.CompetitionUtils;
import com.itechart.foxhunt.domain.entity.CompetitionEntity;
import com.itechart.foxhunt.domain.entity.FoxPointEntity;
import com.itechart.foxhunt.domain.entity.UserEntity;
import com.itechart.foxhunt.domain.enums.CompetitionStatus;
import com.itechart.foxhunt.domain.enums.NotificationType;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyEmitter;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

import static com.itechart.foxhunt.api.competition.UserEntityUtils.getStartPositionForCompetition;

@Slf4j
@Data
public class ActiveCompetitionJob implements Runnable {

    private final ThreadPoolTaskScheduler threadPoolTaskScheduler;

    private final CompetitionResultService competitionResultService;

    private CompetitionEntity competitionEntity;

    private int activeFoxIndex = 0; // Index of array "foxPointIndexes". "0" stands for silence interval
    private long foxCycleIndex = 0; // Index of foxCycle. "0" means competition hasn't started yet.
    private List<Integer> foxPointIndexes = new ArrayList<>(); // Indexes of all activeFoxes of the competition
    private Map<Long, List<Long>> participants = new HashMap<>(); // Store userIds of participants according to their
    // start position
    private LocalDateTime currentFoxEndTime;
    private LocalDateTime competitionEndTime;
    private final Map<Long, SseEmitter> activeSubscribers = new HashMap<>();
    private final Map<Long, SseEmitter> awaitingSubscribers = new HashMap<>();

    public ActiveCompetitionJob(CompetitionEntity competitionEntity, ThreadPoolTaskScheduler threadPoolTaskScheduler,
            CompetitionResultService competitionResultService) {
        this.competitionEntity = competitionEntity;
        this.threadPoolTaskScheduler = threadPoolTaskScheduler;
        this.competitionResultService = competitionResultService;
    }

    public void initializeCompetition(CompetitionEntity competition) {
        this.competitionEntity = competition;
        // Populating foxPointIndexes with indexes, which have gotten from frontend
        this.foxPointIndexes.add(0); // Adding index for silence interval
        this.foxPointIndexes.addAll(this.competitionEntity.getFoxPoints().stream()
                .map(FoxPointEntity::getIndex)
                .sorted()
                .collect(Collectors.toList()));
        // Populating participants Map<startPosition, List of userIds>
        competition.getParticipants().forEach(competitionParticipant -> {
            Long startPosition = competitionParticipant.getStartPosition();
            Long userId = competitionParticipant.getUser().getId();
            if (participants.containsKey(startPosition)) {
                participants.get(startPosition).add(userId);
            } else {
                List<Long> userIds = new ArrayList<>(2);
                userIds.add(userId);
                participants.put(startPosition, userIds);
            }
            // Notify all awaiting subscribers about new time to start and set readyToStart
            // notifications in threadPoolTaskScheduler
            SseEmitter client = awaitingSubscribers.get(userId);
            if (client != null) {
                Long timeToStart = getStartTimeDelay(startPosition);
                sendCompetitionStartNotification(client, timeToStart, competition.getActualStartDate());
                setReadyToStartNotification(client, timeToStart);
            }
        });
    }

    private void setReadyToStartNotification(SseEmitter client, Long timeToStart) {
        if (timeToStart > ReadyToStartJob.READY_TIME_SECONDS) {
            threadPoolTaskScheduler.schedule(new ReadyToStartJob(client, competitionEntity.getStartDate()),
                    LocalDateTime.now().plusSeconds(timeToStart - ReadyToStartJob.READY_TIME_SECONDS)
                            .atZone(ZoneId.systemDefault()).toInstant());
        }
    }

    private long getStartTimeDelay(Long startPosition) {
        return (startPosition - 1)
                * (competitionEntity.getFoxPoints().size() + (competitionEntity.isHasSilenceInterval() ? 1 : 0))
                * competitionEntity.getFoxDuration();
    }

    public synchronized void addClient(final SseEmitter client, final UserEntity subscriber) {
        if (competitionEntity.getStatus().equals(CompetitionStatus.SCHEDULED)) {
            // Send time to competition start date as we don't know participants groups
            long timeToStart = Duration.between(LocalDateTime.now(), competitionEntity.getStartDate()).getSeconds();
            sendTimeToStart(client, timeToStart, competitionEntity.getStartDate());
            awaitingSubscribers.put(subscriber.getId(), client);
        } else if (competitionEntity.getStatus().equals(CompetitionStatus.RUNNING)) {
            if (getStartPositionForCompetition(competitionEntity, subscriber) > foxCycleIndex) {
                long startTimeDelay = getStartTimeDelay(getStartPositionForCompetition(competitionEntity, subscriber));
                long timeToStart = Duration
                        .between(LocalDateTime.now(), competitionEntity.getStartDate().plusSeconds(startTimeDelay))
                        .getSeconds();
                sendTimeToStart(client, timeToStart, competitionEntity.getActualStartDate());
                setReadyToStartNotification(client, timeToStart);
                awaitingSubscribers.put(subscriber.getId(), client);
            } else {
                sendActiveFox(client);
                activeSubscribers.put(subscriber.getId(), client);
            }
        }
    }

    public void removeClient(final SseEmitter client) {
        activeSubscribers.values().remove(client);
        awaitingSubscribers.values().remove(client);
    }

    public synchronized void finishCompetition() {
        final Map<Long, SseEmitter> subscribers = new HashMap<>();
        subscribers.putAll(activeSubscribers);
        subscribers.putAll(awaitingSubscribers);

        subscribers.forEach((key, value) -> {
            SseEmitter client = value;
            if (client != null) {
                sendClosedNotification(client);
            }
        });
        activeSubscribers.values().forEach(ResponseBodyEmitter::complete);
        awaitingSubscribers.values().forEach(ResponseBodyEmitter::complete);
    }

    @Override
    // Notify all active subscribers about new active fox index
    // If new fox cycle starts - manage new active subscribers from awaiting ones
    public synchronized void run() {
        if (activeFoxIndex < competitionEntity.getFoxPoints().size()) {
            activeFoxIndex++;
        } else {
            activeFoxIndex = (competitionEntity.isHasSilenceInterval()) ? 0 : 1;
        }
        if (activeFoxIndex == 1) {
            startNewFoxCycle();
        }
        final int competitionDuration = CompetitionUtils.competitionDuration(competitionEntity);
        final int foxDuration = competitionEntity.getFoxDuration();
        final int foxRange = competitionEntity.getFoxRange();
        final boolean foxoringEnabled = competitionEntity.isFoxoringEnabled();

        if (competitionEndTime == null) {
            competitionEndTime = competitionEntity.getActualStartDate().plusSeconds(competitionDuration);
        }

        participantExpirationManager();
        currentFoxEndTime = LocalDateTime.now().plusSeconds(competitionEntity.getFoxDuration());

        if (competitionEndTime.isBefore(LocalDateTime.now())) {
            sendEventToAllActiveSubscribers(NotificationType.COMPETITION_IS_EXPIRED.name(),
                    new ExpiredCompetition(true));
        } else {
            ActiveCompetition activeCompetitionInfo = ActiveCompetition.builder()
                    .activeFoxIndex(foxPointIndexes.get(activeFoxIndex))
                    .competitionDuration(competitionDuration)
                    .foxDuration(foxDuration)
                    .foxRange(foxRange)
                    .foxoringEnabled(foxoringEnabled)
                    .secondsToCompetitionEnd(getSecondsToCompetitionEnd())
                    .secondsToFoxChange(getSecondsToFoxChange())
                    .build();
            sendEventToAllActiveSubscribers(NotificationType.ACTIVE_FOX.name(), activeCompetitionInfo);
        }
    }

    private void sendEventToAllActiveSubscribers(String notificationType, Object data) {
        List<SseEmitter> deadClients = new ArrayList<>();
        activeSubscribers.values().forEach(client -> {
            try {
                client.send(SseEmitter.event().name(notificationType)
                        .data(data));
            } catch (Exception e) {
                deadClients.add(client);
            }
        });

        activeSubscribers.values().removeAll(deadClients);
    }

    // Used to handle a situation when a participant has not finished the
    // competition but the time is up
    private void participantExpirationManager() {
        final long diff = ChronoUnit.SECONDS.between(LocalDateTime.now(), competitionEndTime);

        if (diff <= CompetitionUtils.participantTime(competitionEntity)
                && competitionEntity.getActualFinishDate() == null) {
            final Set<Long> participantIds = competitionResultService.participantFinishWhenExpired(competitionEntity);

            if (participantIds != null) {
                participantIds.forEach(participantId -> {
                    SseEmitter subscriber = activeSubscribers.get(participantId);
                    if (subscriber != null) {
                        sendParticipantTimeIsUpNotification(subscriber);
                    }
                });
            }
        }
    }

    private void startNewFoxCycle() {
        foxCycleIndex++;
        moveAwaitingSubscribersToActiveSubscribers();
    }

    private void moveAwaitingSubscribersToActiveSubscribers() {
        List<Long> userIds = participants.get(foxCycleIndex);
        if (userIds != null) {
            userIds.forEach(userId -> {
                SseEmitter startingSubscriber = awaitingSubscribers.remove(userId);
                if (startingSubscriber != null) {
                    activeSubscribers.put(userId, startingSubscriber);
                    sendParticipantStartNotification(startingSubscriber);
                }
            });
        }
    }

    private void sendParticipantStartNotification(SseEmitter client) {
        try {
            client.send(SseEmitter.event()
                    .name(NotificationType.PARTICIPANT_START.name())
                    .data(""));
        } catch (Exception e) {
            log.error(String.format("Can't send PARTICIPANT_START notification as %s", e.getMessage()));
        }
    }

    private void sendParticipantTimeIsUpNotification(SseEmitter client) {
        try {
            client.send(SseEmitter.event().name(NotificationType.PARTICIPANT_TIME_IS_UP.name()).data(""));
        } catch (Exception e) {
            log.error(String.format("Can't send PARTICIPANT_TIME_IS_UP notification as %s", e.getMessage()));
        }
    }

    private void sendCompetitionStartNotification(SseEmitter client, Long timeToStart, LocalDateTime startMoment) {
        try {
            client.send(SseEmitter.event().name(NotificationType.COMPETITION_START.name())
                    .data(new TimeToStartNotification(timeToStart, startMoment)));
        } catch (Exception e) {
            log.error(String.format("Can't send COMPETITION_START notification as %s", e.getMessage()));
        }
    }

    private void sendClosedNotification(SseEmitter client) {
        try {
            client.send(SseEmitter.event().name(NotificationType.COMPETITION_CLOSED.name())
                    .data(new ClosedCompetitionNotification(LocalDateTime.now())));
        } catch (Exception e) {
            log.error(String.format("Can't send COMPETITION_CLOSED notification as %s", e.getMessage()));
        }
    }

    private void sendActiveFox(final SseEmitter client) {

        final int competitionDuration = CompetitionUtils.competitionDuration(competitionEntity);
        final int foxDuration = competitionEntity.getFoxDuration();
        final int foxRange = competitionEntity.getFoxRange();
        final boolean foxoringEnabled = competitionEntity.isFoxoringEnabled();

        if (competitionEndTime == null) {
            competitionEndTime = competitionEntity.getActualStartDate().plusSeconds(competitionDuration);
        }

        try {
            ActiveCompetition activeCompetitionInfo = ActiveCompetition.builder()
                    .activeFoxIndex(foxPointIndexes.get(activeFoxIndex))
                    .competitionDuration(competitionDuration)
                    .foxDuration(foxDuration)
                    .foxRange(foxRange)
                    .foxoringEnabled(foxoringEnabled)
                    .secondsToCompetitionEnd(getSecondsToCompetitionEnd())
                    .secondsToFoxChange(getSecondsToFoxChange())
                    .build();
            client.send(SseEmitter.event().name(NotificationType.ACTIVE_FOX.name()).data(activeCompetitionInfo));
        } catch (Exception e) {
            log.error(String.format("Can't send ACTIVE_FOX notification as %s", e.getMessage()));
        }
    }

    public ActiveCompetition getActiveCompetitionInfo() {
        final int competitionDuration = CompetitionUtils.competitionDuration(competitionEntity);
        final int foxDuration = competitionEntity.getFoxDuration();
        final int foxRange = competitionEntity.getFoxRange();
        final boolean foxoringEnabled = competitionEntity.isFoxoringEnabled();

        return ActiveCompetition.builder()
                .activeFoxIndex(foxPointIndexes.get(activeFoxIndex))
                .competitionDuration(competitionDuration)
                .foxDuration(foxDuration)
                .foxRange(foxRange)
                .foxoringEnabled(foxoringEnabled)
                .secondsToCompetitionEnd(getSecondsToCompetitionEnd())
                .secondsToFoxChange(getSecondsToFoxChange())
                .build();
    }

    private void sendTimeToStart(final SseEmitter client, long timeToStart, LocalDateTime startMoment) {
        try {
            client.send(SseEmitter.event().name(NotificationType.INITIAL_NOTIFICATION.name())
                    .data(new TimeToStartNotification(timeToStart, startMoment)));
        } catch (Exception e) {
            log.error(String.format("Can't send INITIAL_NOTIFICATION notification as %s", e.getMessage()));
        }
    }

    public int getActiveFoxIdx() {
        return activeFoxIndex;
    }

    public ActiveFoxInfo getActiveFoxInfo() {
        FoxPointEntity activeFoxPoint = competitionEntity.getFoxPoints().stream()
                .filter(fox -> fox.getIndex() == activeFoxIndex)
                .findFirst()
                .orElse(null);

        long timeToFoxChange = LocalDateTime.now().until(currentFoxEndTime, ChronoUnit.SECONDS);
        return ActiveFoxInfo.builder().foxPoint(activeFoxPoint).timeToChangeActiveFox(timeToFoxChange).build();

    }

    public void sendResultToSubscribers(CompetitionResult competitionResult) {

        final Map<Long, SseEmitter> subscribers = new HashMap<>();
        subscribers.putAll(activeSubscribers);
        subscribers.putAll(awaitingSubscribers);

        subscribers.values().stream().forEach(v -> sendCompetitionResultNotification(v, competitionResult));
    }

    private void sendCompetitionResultNotification(SseEmitter client, CompetitionResult competitionResult) {
        try {
            client.send(SseEmitter.event().name(NotificationType.COMPETITION_RESULT.name())
                    .data(competitionResult));
        } catch (Exception e) {
            log.error(String.format("Can't send COMPETITION_RESULT notification as %s", e.getMessage()));
        }
    }

    private long getSecondsToCompetitionEnd() {
        return Duration.between(LocalDateTime.now(), competitionEndTime).getSeconds();
    }

    private long getSecondsToFoxChange() {
        return Duration.between(LocalDateTime.now(), currentFoxEndTime).getSeconds();
    }
}
