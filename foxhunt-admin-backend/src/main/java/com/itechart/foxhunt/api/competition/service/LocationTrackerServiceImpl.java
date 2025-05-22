package com.itechart.foxhunt.api.competition.service;

import com.itechart.foxhunt.api.competition.dto.ActiveTracker;
import com.itechart.foxhunt.api.competition.dto.ActiveTrackerProjection;
import com.itechart.foxhunt.api.competition.dto.Participant;
import com.itechart.foxhunt.api.competition.job.ActiveTrackerJob;
import com.itechart.foxhunt.api.competition.repository.LocationTrackerRepository;
import com.itechart.foxhunt.api.competition.repository.PathStoryRepository;
import com.itechart.foxhunt.domain.entity.CompetitionEntity;
import com.itechart.foxhunt.domain.entity.LocationTrackerEntity;
import com.itechart.foxhunt.domain.entity.PathStoryEntity;
import com.itechart.foxhunt.domain.entity.UserEntity;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class LocationTrackerServiceImpl implements LocationTrackerService {

    private static final int DELAY_MILLISECONDS = 1000;

    @Value("${foxhunt.competition.participant-disconnect-timeout}")
    private int participantDisconnectTimeout;

    private final Map<Long, ActiveTrackerJob> trackerJobs = new HashMap<>();

    private final Map<Long, ScheduledFuture<ActiveTrackerJob>> scheduledFutures = new HashMap<>();

    record DisconnectEventId(Long competitionId, Long userId) {
    }

    private final Map<DisconnectEventId, ScheduledFuture<?>> disconnectedEventsToSend = new ConcurrentHashMap<>();

    private final LocationTrackerRepository locationTrackerRepository;

    private final PathStoryRepository pathStoryRepository;

    private final ThreadPoolTaskScheduler threadPoolTaskScheduler;

    @Override
    public void subscribeToLocationNotification(final Long competitionId, final SseEmitter client) {
        log.info("Adding new subscriber for location notifications for competition {}", competitionId);
        if (!trackerJobs.containsKey(competitionId)) {
            log.debug("Location notification job for competition {} has not been created before, creating", competitionId);
            addJob(competitionId);
        }
        ActiveTrackerJob activeTrackerJob = trackerJobs.get(competitionId);

        activeTrackerJob.addTracker(client);

        client.onCompletion(() -> activeTrackerJob.remove(client));
        client.onTimeout(() -> activeTrackerJob.remove(client));
    }

    @Override
    public void startById(Long competitionId, List<Participant> participants) {
        log.info("Start notification sending for competition {}", competitionId);
        final List<LocationTrackerEntity> allCurrentLocations = locationTrackerRepository
            .findAllByCompetitionId(competitionId);
        if (allCurrentLocations.isEmpty() || allCurrentLocations.size() < participants.size()) {
            participants.forEach(participant -> {
                log.debug("Initialize participant {} location tracker in competition {}", participant.getId(), competitionId);
                createTracker(competitionId, participant.getId());
            });
        }

        sendNotification(competitionId);
    }

    @Override
    public void finishById(Long competitionId) {
        log.info("Stop notification sending for competition {}", competitionId);
        finishNotification(competitionId);
    }

    private void addJob(final Long competitionId) {
        trackerJobs.put(competitionId,
            new ActiveTrackerJob(competitionId, locationTrackerRepository));
    }

    private void sendNotification(Long competitionId) {
        // check if competitions presents
        if (!trackerJobs.containsKey(competitionId)) {
            log.debug("Location notification job for competition {} has not been created before, creating", competitionId);
            addJob(competitionId);
        }

        final ActiveTrackerJob activeTrackerJob = trackerJobs.get(competitionId);

        // send event to clients
        ScheduledFuture scheduledFuture =
            threadPoolTaskScheduler.scheduleAtFixedRate(activeTrackerJob, DELAY_MILLISECONDS);

        scheduledFutures.put(competitionId, scheduledFuture);
    }

    private void finishNotification(Long competitionId) {
        disconnectedEventsToSend.keySet().stream()
            .filter(disconnectEventId -> disconnectEventId.competitionId.equals(competitionId))
            .forEach(disconnectEventId -> {
                disconnectedEventsToSend.get(disconnectEventId).cancel(true);
                disconnectedEventsToSend.remove(disconnectEventId);
            });

        ScheduledFuture<ActiveTrackerJob> scheduledFuture = scheduledFutures.remove(competitionId);
        // stop sending events to clients
        if (scheduledFuture != null) {
            scheduledFuture.cancel(true);
        }

        ActiveTrackerJob activeTrackerJob = trackerJobs.remove(competitionId);
        if (activeTrackerJob != null) {
            activeTrackerJob.finish();
        }
    }

    private LocationTrackerEntity createTracker(final Long competitionId, final Long participantId) {
        LocationTrackerEntity locationTrackerEntity = new LocationTrackerEntity();
        locationTrackerEntity.setCompetition(new CompetitionEntity(competitionId));
        locationTrackerEntity.setParticipant(new UserEntity(participantId));
        return locationTrackerRepository.save(locationTrackerEntity);
    }

    @Override
    public void saveActiveTracker(ActiveTracker activeTracker) {
        Long participantId = activeTracker.getParticipantId();
        log.info("Saving active tracker {} from participant {} in competition {}", activeTracker, participantId, activeTracker.getCompetitionId());

        createEntityAndSaveTracker(activeTracker);
        setupJobOnParticipantDisconnect(activeTracker);
    }

    private void createEntityAndSaveTracker(ActiveTracker activeTracker) {
        LocationTrackerEntity userLocationTrackerId =
            locationTrackerRepository.findTrackerIdByCompetitionIdAndUserId(activeTracker.getCompetitionId(),
                activeTracker.getParticipantId());

        if (userLocationTrackerId == null) {
            userLocationTrackerId = createTracker(activeTracker.getCompetitionId(), activeTracker.getParticipantId());
        }

        PathStoryEntity pathStoryEntity = PathStoryEntity.builder()
            .locationTrackerEntity(userLocationTrackerId)
            .currentPlace(activeTracker.getCurrentLocation())
            .gameTime(LocalDateTime.now())
            .timeToFoxChange(activeTracker.getActiveFoxInfo().getTimeToChangeActiveFox())
            .isDisconnected(false)
            .build();

        if (activeTracker.getActiveFoxInfo().getFoxPoint() != null) {
            pathStoryEntity.setActiveFox(activeTracker.getActiveFoxInfo().getFoxPoint());
        }

        pathStoryRepository.save(pathStoryEntity);
    }

    private void setupJobOnParticipantDisconnect(ActiveTracker activeTracker) {
        Long participantId = activeTracker.getParticipantId();
        Long competitionId = activeTracker.getCompetitionId();
        DisconnectEventId disconnectEventId = new DisconnectEventId(competitionId, participantId);
        int remainingDelayToRecreateJob = 5;

        var disconnectEventFuture = disconnectedEventsToSend.get(disconnectEventId);
        if (disconnectEventFuture != null) {
            if ((disconnectEventFuture.getDelay(TimeUnit.SECONDS) < remainingDelayToRecreateJob)) {
                disconnectedEventsToSend.get(disconnectEventId).cancel(true);
                disconnectedEventsToSend.remove(disconnectEventId);
                scheduleDisconnectEventNotification(disconnectEventId, activeTracker);
            }
        } else {
            scheduleDisconnectEventNotification(disconnectEventId, activeTracker);
        }
    }

    private void scheduleDisconnectEventNotification(DisconnectEventId disconnectEventId, ActiveTracker activeTracker) {
        ScheduledExecutorService executor = threadPoolTaskScheduler.getScheduledExecutor();
        var sendDisconnectEventFuture = executor.schedule(
            () -> executeDisconnectParticipantNotification(activeTracker), participantDisconnectTimeout, TimeUnit.SECONDS);
        disconnectedEventsToSend.put(disconnectEventId, sendDisconnectEventFuture);
    }

    private void executeDisconnectParticipantNotification(ActiveTracker activeTracker) {
        ActiveTracker locationMarkedDisconnected =
            markLastParticipantLocationAsDisconnected(activeTracker.getCompetitionId(), activeTracker.getParticipantId());
        sendDisconnectNotification(locationMarkedDisconnected);
    }

    private ActiveTracker markLastParticipantLocationAsDisconnected(Long competitionId, Long participantId) {
        PathStoryEntity locationMarkedDisconnected = pathStoryRepository
            .findLastPathStoryRecordByCompetitionIdAndParticipantId(competitionId, participantId)
            .map(pathStory -> {
                pathStory.setIsDisconnected(true);
                return pathStoryRepository.save(pathStory);
            }).orElseThrow(() -> new IllegalArgumentException(
                String.format("Unable to find last location tracker for competition %s and participant %s",
                    competitionId, participantId)));

        log.info("Marked last location tracker for competition {} and participant {} as disconnected",
            competitionId, participantId);
        return ActiveTracker.builder()
            .competitionId(competitionId)
            .participantId(participantId)
            .currentLocation(locationMarkedDisconnected.getCurrentPlace())
            .build();
    }

    private void sendDisconnectNotification(ActiveTracker activeTracker) {
        log.info("Sending disconnect notification for participant {} in competition {}",
            activeTracker.getParticipantId(), activeTracker.getCompetitionId());
        ActiveTrackerJob activeTrackerJob = trackerJobs.get(activeTracker.getCompetitionId());
        if (activeTrackerJob != null) {
            activeTrackerJob.sendDisconnectNotification(activeTracker);
        }
    }

    @Override
    public List<ActiveTracker> getLastParticipantTrackersForCompetition(Long competitionId, int trackersQuantity) {
        return locationTrackerRepository.findTrackersByCompetitionId(competitionId, trackersQuantity);
    }

    @Override
    public List<ActiveTracker> getLastParticipantTrackersForCompetition(Long competitionId, Long participantId
        , long startPosition, int endPosition) {
        log.info("Retrieving trackers for participant {} in competition {} in range of {} to {}", participantId, competitionId, startPosition, endPosition);
        List<ActiveTrackerProjection> activeTrackerProjections = locationTrackerRepository.findTrackersByCompetitionIdAndParticipantIds(competitionId, participantId, startPosition, endPosition);
        return activeTrackerProjections.stream()
            .map(view -> new ActiveTracker(view.getParticipantId(),
                view.getGameTime(),
                view.getCurrentLocation(),
                view.getPathStory(),
                view.getIsDisconnected())
            ).collect(Collectors.toList());
    }

    @Override
    public Long countLastParticipantTrackersForCompetition(Long competitionId, Long participantId) {
        log.info("Counting trackers for participant {} in competition {}", participantId, competitionId);
        return locationTrackerRepository.countTrackersByCompetitionIdAndParticipantIds(competitionId, participantId);
    }

    @Override
    public void restoreTrackerJobs(List<Long> restoredCompetitionIds) {
        if (restoredCompetitionIds == null) {
            return;
        }
        restoredCompetitionIds.forEach(this::sendNotification);
    }
}
