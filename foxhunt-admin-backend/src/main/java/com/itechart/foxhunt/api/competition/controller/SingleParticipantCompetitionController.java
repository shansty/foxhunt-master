package com.itechart.foxhunt.api.competition.controller;

import com.itechart.foxhunt.api.auth.security.LoggedUserService;
import com.itechart.foxhunt.api.competition.dto.Competition;
import com.itechart.foxhunt.api.competition.dto.SingleParticipantCompetition;
import com.itechart.foxhunt.api.competition.service.SingleParticipantCompetitionService;
import com.itechart.foxhunt.api.core.ApiConstants;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping(ApiConstants.SINGLE_PARTICIPANT_COMPETITIONS)
@RequiredArgsConstructor
public class SingleParticipantCompetitionController {

    private final SingleParticipantCompetitionService competitionService;

    private final LoggedUserService loggedUserService;

    @PostMapping
    @Secured(value = {ApiConstants.ROLE_PARTICIPANT})
    public ResponseEntity<Competition> createSingleParticipantCompetition(@Valid @RequestBody final SingleParticipantCompetition competition) {
        return new ResponseEntity<>(
            competitionService.create(competition, loggedUserService.getLoggedUser()),
            HttpStatus.CREATED);
    }

    @GetMapping
    @Secured(value = {ApiConstants.ROLE_PARTICIPANT})
    public List<Competition> getAllSingleParticipantCompetitions() {
        Long userId = loggedUserService.getLoggedUserEntity().getId();
        return competitionService.getAllByUserId(userId);
    }
}
