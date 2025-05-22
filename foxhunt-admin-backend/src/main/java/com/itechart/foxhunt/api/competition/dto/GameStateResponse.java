package com.itechart.foxhunt.api.competition.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.itechart.foxhunt.api.user.dto.UserResult;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class GameStateResponse {

    private List<UserResult> results;
    private ActiveCompetition activeCompetition;
    private List<ParticipantTracker> participantTrackers;

}
