package com.itechart.foxhunt.api.competition.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ActiveCompetition {
    private final int activeFoxIndex;

    private final long competitionDuration; // in seconds

    private final long foxDuration;

    private final long foxRange;

    private final long secondsToFoxChange;

    private final long secondsToCompetitionEnd;
}
