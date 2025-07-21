package com.itechart.foxhunt.api.competition.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonView;
import com.itechart.foxhunt.api.competition.CompetitionFrequency;
import org.locationtech.jts.geom.Point;
import lombok.Data;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Data
@JsonView(View.UpcomingCompetition.class)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class FoxPoint {

    private Long id;

    @NotNull(message = "Index cannot be NULL")
    @Min(value = 1, message = "Index must be more then 0")
    @Max(value = 5, message = "Index must not exceed 5 (as it's max number of foxes in competition")
    private Integer index;

    @Size(max = 40, message = "Label cannot exceed 40 characters")
    private String label;

    @NotNull(message = "Fox Point coordinates must be set")
    private Point coordinates;

    @NotNull(message = "Fox Point circle center must be set")
    @JsonProperty("circleCenter")
    private Point circle_center;

    @CompetitionFrequency(precision = 0.1)
    private Double frequency;
}
