package com.itechart.foxhunt.api.competition.service;

import com.itechart.foxhunt.api.competition.dto.ActiveTracker;
import com.itechart.foxhunt.domain.entity.CompetitionEntity;
import com.itechart.foxhunt.api.competition.dto.FoxPoint;
import com.itechart.foxhunt.api.user.dto.UserResult;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

public interface CompetitionResultService {

    @Transactional
    FoxPoint  updateCompetitionResults(ActiveTracker activeTracker);

    @Transactional
    List<UserResult> getUsersResult(Long competitionId);

    @Transactional
    void participantFinish(ActiveTracker activeTracker);

    boolean isUserVisitFinishPoint(ActiveTracker activeTracker);

    boolean isUserOutsidePolygon(ActiveTracker activeTracker);

    Set<Long> participantFinishWhenExpired(CompetitionEntity competitionEntity);
}
