package com.itechart.foxhunt.api.competition.job;

import com.itechart.foxhunt.api.competition.CompetitionUtils;
import com.itechart.foxhunt.api.competition.dto.ActiveTracker;
import com.itechart.foxhunt.api.competition.dto.ParticipantTracker;
import com.itechart.foxhunt.api.competition.repository.LocationTrackerRepository;
import com.itechart.foxhunt.domain.enums.NotificationType;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyEmitter;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Slf4j
public class ActiveTrackerJob implements Runnable {

    private static final int TRACKER_QUANTITY = 8;

    private final LocationTrackerRepository locationTrackerRepository;

    private final Long competitionId;

    private final List<SseEmitter> trackersSse = new CopyOnWriteArrayList<>();

    public ActiveTrackerJob(Long competitionId, LocationTrackerRepository locationTrackerRepository) {
        this.competitionId = competitionId;
        this.locationTrackerRepository = locationTrackerRepository;
    }

    public synchronized void addTracker(SseEmitter emitter) {
        trackersSse.add(emitter);
    }

    public synchronized void finish() {
        trackersSse.forEach(ResponseBodyEmitter::complete);
    }

    @Override
    public void run() {
        List<ActiveTracker> activeTrackers = locationTrackerRepository.findTrackersByCompetitionId(competitionId,
            TRACKER_QUANTITY);
        if (!activeTrackers.isEmpty()) {
            trackersSse.forEach(sseEmitter -> {
                List<ParticipantTracker> participantTrackers = buildParticipantTrackerList(activeTrackers);
                log.warn("ParticipantTrackers are", participantTrackers);
                sendEvent(sseEmitter, NotificationType.CURRENT_LOCATION, participantTrackers);
            });
        }
    }

    public void remove(SseEmitter emitter) {
        trackersSse.remove(emitter);
    }

    public void sendDisconnectNotification(ActiveTracker lastTrackerBeforeDisconnect) {
        log.info("User {} disconnected, sending notification to competition watchers",
            lastTrackerBeforeDisconnect.getParticipantId());
        trackersSse.forEach(sseEmitter ->
            sendEvent(sseEmitter, NotificationType.PARTICIPANT_DISCONNECTED, lastTrackerBeforeDisconnect));
    }

    private List<ParticipantTracker> buildParticipantTrackerList(List<ActiveTracker> activeTrackers) {
        return CompetitionUtils.activeTrackersToParticipantTrackerList(activeTrackers)
            .stream()
            .peek(participantTracker -> {
                List<ActiveTracker> activeTrackersSortedByTime = participantTracker.getTrackerList().stream()
                    .sorted(Comparator.comparing(ActiveTracker::getGameTime).reversed()).toList();
                participantTracker.setTrackerList(activeTrackersSortedByTime);
            }).toList();
    }

    private void sendEvent(SseEmitter emitter, NotificationType notificationType, Object dataToSend) {
        try {
            var eventToSend = SseEmitter.event()
                .name(notificationType.name())
                .data(dataToSend);
            emitter.send(eventToSend);
        } catch (IOException e) {
            emitter.completeWithError(e);
        }
    }

}
