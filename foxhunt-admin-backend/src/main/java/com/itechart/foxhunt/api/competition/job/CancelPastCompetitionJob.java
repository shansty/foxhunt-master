package com.itechart.foxhunt.api.competition.job;

import com.itechart.foxhunt.api.competition.repository.CompetitionRepository;
import com.itechart.foxhunt.domain.entity.CompetitionEntity;
import com.itechart.foxhunt.domain.enums.CompetitionStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class CancelPastCompetitionJob {

    private final CompetitionRepository competitionRepository;

    @PostConstruct
    public void init() {
        cancelPastCompetitions();
    }

    @Scheduled(cron = "0 0 7 * * ?")
    public void doJob() {
        cancelPastCompetitions();
    }

    private void cancelPastCompetitions() {
        List<CompetitionEntity> expiredCompetitions = competitionRepository
            .getAllExpiredScheduledCompetitions()
            .stream()
            .peek(competitionEntity -> competitionEntity.setStatus(CompetitionStatus.CANCELED))
            .collect(Collectors.toList());

        competitionRepository.saveAll(expiredCompetitions);
    }
}
