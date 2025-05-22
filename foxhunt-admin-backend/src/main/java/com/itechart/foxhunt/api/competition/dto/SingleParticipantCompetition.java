package com.itechart.foxhunt.api.competition.dto;

import com.itechart.foxhunt.api.competition.CompetitionFrequency;
import org.locationtech.jts.geom.Point;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SingleParticipantCompetition {

    @Max(value = 2, message = "Number of foxes must be 1 or 2")
    @Min(value = 1, message = "Number of foxes must be 1 or 2")
    @NotNull(message = "Amount of foxes must be set")
    private Byte foxAmount;

    private boolean hasSilenceInterval;

    @CompetitionFrequency()
    private Double frequency;

    @NotNull(message = "Participant's current position must be set")
    private Point center;
}
