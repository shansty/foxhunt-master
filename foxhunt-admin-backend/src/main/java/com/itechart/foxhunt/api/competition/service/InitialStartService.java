package com.itechart.foxhunt.api.competition.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.List;

@Component
@RequiredArgsConstructor
public class InitialStartService {

    private final ActiveCompetitionService activeCompetitionService;

    private final LocationTrackerService locationTrackerService;

    @PostConstruct
    private void restartJobsForRunningCompetitions(){

       List<Long> restoredIds = activeCompetitionService.restoreCompetitionStateForRunningCompetitions();
       locationTrackerService.restoreTrackerJobs(restoredIds);
    }
}
