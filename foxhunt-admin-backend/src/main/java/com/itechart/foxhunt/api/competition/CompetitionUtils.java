package com.itechart.foxhunt.api.competition;

import com.itechart.foxhunt.api.competition.dto.ActiveTracker;
import com.itechart.foxhunt.api.competition.dto.ParticipantTracker;
import com.itechart.foxhunt.domain.entity.CompetitionEntity;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class CompetitionUtils {

    public static int competitionDuration(CompetitionEntity competitionEntity) {
        int participantsTime = participantTime(competitionEntity);
        if (competitionEntity.isHasSilenceInterval()) {
            participantsTime = (int) (Math.ceil(competitionEntity.getParticipants().size() / 2))
                    * competitionEntity.getFoxDuration() * competitionEntity.getFoxAmount()
                    + competitionEntity.getFoxDuration();
        }
        return 3 * 60 * 60 + participantsTime;
    }

    public static int participantTime(CompetitionEntity competitionEntity) { // amount of time provided above the common 3 hours for a competition
        return (int) (Math.ceil(competitionEntity.getParticipants().size() / 2))
                * competitionEntity.getFoxDuration() * competitionEntity.getFoxAmount();
    }

    public static String secondsToHHMMSS(CompetitionEntity competitionEntity) {
        final int seconds = competitionDuration(competitionEntity);
        final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("H:mm:ss");
        final LocalDateTime time = LocalDateTime.MIN.plusSeconds(seconds);
        return formatter.format(time).replaceFirst(":", "h").replace(":", "m") + "s";// e. g. 3h03m00s
    }

    public static List<ParticipantTracker> activeTrackersToParticipantTrackerList(List<ActiveTracker> activeTrackerList){
        List<ParticipantTracker> participantTrackers = new ArrayList<>();
        if(activeTrackerList.isEmpty()){
            return participantTrackers;
        }

        var participantTrackersMap = activeTrackerList.stream()
                .collect( Collectors.groupingBy(ActiveTracker::getParticipantId));

        return participantTrackersMap
                .entrySet()
                .stream()
                .map(e ->new ParticipantTracker(e.getKey(), e.getValue()))
                .collect(Collectors.toList());
    }
}
