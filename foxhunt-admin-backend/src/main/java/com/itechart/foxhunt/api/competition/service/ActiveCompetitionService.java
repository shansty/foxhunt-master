package com.itechart.foxhunt.api.competition.service;

import com.itechart.foxhunt.api.competition.dto.Competition;
import com.itechart.foxhunt.api.competition.dto.FoxPoint;
import com.itechart.foxhunt.api.competition.dto.Participant;
import com.itechart.foxhunt.api.competition.dto.ActiveCompetition;
import com.itechart.foxhunt.api.competition.dto.ActiveFoxInfo;
import com.itechart.foxhunt.domain.entity.UserEntity;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import java.util.List;

public interface ActiveCompetitionService {

    void subscribeToCompetition(Long competitionId, SseEmitter client, UserEntity subscriber,
        Long organizationId);

    List<Competition> getActiveCompetitions(Long userId, Long organizationId);

    Competition getActiveCompetitionById(Long userId, Long organizationId, Long competitionId);

    Competition startById(Long id, List<FoxPoint> foxPoints, List<Participant> participants,
        Long organizationId);

    Competition finishById(Long id, String reasonToStop, Long organizationId);

    Competition cancelById(Long id, Long organizationId);

    ActiveFoxInfo getActiveFoxInfo(final Long competitionId);

    ActiveCompetition getActiveCompetitionInfo(Long competitionId);

    List<Long> restoreCompetitionStateForRunningCompetitions();

    void completeCurrentEmitter(UserEntity subscriber);

    void finishExpiredCompetitions();
}
