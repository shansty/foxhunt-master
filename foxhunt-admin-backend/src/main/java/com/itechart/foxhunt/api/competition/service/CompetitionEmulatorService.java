package com.itechart.foxhunt.api.competition.service;

import com.itechart.foxhunt.api.competition.dto.Competition;

import java.util.concurrent.CompletableFuture;

public interface CompetitionEmulatorService {

    CompletableFuture<Void> emulateCompetition(Competition competition);

    void finishCompetitionEmulation(Long competitionId);
}
