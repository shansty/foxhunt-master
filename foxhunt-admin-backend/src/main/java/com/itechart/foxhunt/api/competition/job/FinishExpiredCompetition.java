package com.itechart.foxhunt.api.competition.job;

import com.itechart.foxhunt.api.competition.service.ActiveCompetitionService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class FinishExpiredCompetition {

    private final ActiveCompetitionService activeCompetitionService;

    @Scheduled(cron = "0 0 */1 * * *")
    public void doJob() {
        activeCompetitionService.finishExpiredCompetitions();
    }
}
