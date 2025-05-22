package com.itechart.foxhunt.api.competition.service;

import com.itechart.foxhunt.domain.entity.CompetitionEntity;
import com.itechart.foxhunt.api.competition.dto.FoxPoint;
import com.itechart.foxhunt.api.competition.dto.ModifyCompetition;
import com.itechart.foxhunt.api.competition.dto.Participant;

import java.util.List;

public interface CompetitionValidationService {

    void validateStartCompetition(CompetitionEntity competition, List<FoxPoint> foxPoints, List<Participant> participants);

    void validateFinishCompetition(CompetitionEntity competition);

    void validateCancelCompetition(CompetitionEntity competition);

    void validateSubscribeToCompetition(CompetitionEntity competition);

    void validateCreateCompetition(Long organizationId, ModifyCompetition modifyCompetition);

    void validateUpdateCompetition(CompetitionEntity competition, ModifyCompetition modifyCompetition);
}
