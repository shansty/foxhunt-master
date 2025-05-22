package com.itechart.foxhunt.api.competition.service;

import com.itechart.foxhunt.api.competition.dto.Participant;
import com.itechart.foxhunt.api.competition.dto.ActiveTracker;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

public interface LocationTrackerService {

    void subscribeToLocationNotification(Long competitionId, SseEmitter client);

    void startById(Long competitionId, List<Participant> participants);

    void finishById(Long competitionId);

    void saveActiveTracker(ActiveTracker activeTracker);

    List<ActiveTracker> getLastParticipantTrackersForCompetition(Long competitionId, int trackersQuantity);

    List<ActiveTracker> getLastParticipantTrackersForCompetition(Long competitionId, Long participantId,
                                                                 long startPosition, int endPosition);

    Long countLastParticipantTrackersForCompetition(Long competitionId, Long participantId);

    void restoreTrackerJobs(List<Long> restoredCompetitionIds);
}
