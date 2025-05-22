package com.itechart.foxhunt.api.competition.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StartCompetition {

    @NotEmpty(message = "FoxPoints are mandatory to start competition")
    private List<@Valid FoxPoint> foxPoints;

    @NotEmpty(message = "Participants are mandatory to start competition")
    private List<@Valid Participant> participants;
}
