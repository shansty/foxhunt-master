package com.itechart.foxhunt.api.competition.controller;

import com.itechart.foxhunt.api.competition.CompetitionUtils;
import com.itechart.foxhunt.api.competition.dto.ActiveTracker;
import com.itechart.foxhunt.api.competition.dto.ParticipantTracker;
import com.itechart.foxhunt.api.competition.service.LocationTrackerService;
import com.itechart.foxhunt.api.core.ApiConstants;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = ApiConstants.REPLAY_COMPETITIONS, produces = MediaType.APPLICATION_JSON_VALUE)
@AllArgsConstructor
@Slf4j
@Transactional
public class ReplayCompetitionController {

    private final LocationTrackerService locationTrackerService;

    @GetMapping(ApiConstants.ID)
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "List of trackers was successfully loaded")
    })
    @Secured(value = {ApiConstants.ROLE_ORGANIZATION_ADMIN, ApiConstants.ROLE_TRAINER})
    public ResponseEntity<List<ParticipantTracker>> getActiveTrackers(
        @Parameter(description = "Competition id", example = "5") @PathVariable final Long id,
        @Parameter(description = "participant list id", example = "1,2,3") @RequestParam final Long participantId,
        @Parameter(description = "Start position for active trackers", example = "5") @RequestParam final int startPosition,
        @Parameter(description = "Quantity of active trackers", example = "5") @RequestParam final int trackerQuantity) {

        List<ActiveTracker> activeTrackers =
            locationTrackerService.getLastParticipantTrackersForCompetition(id, participantId,
                startPosition, startPosition - trackerQuantity);

        return ResponseEntity
            .ok(CompetitionUtils.activeTrackersToParticipantTrackerList(activeTrackers));
    }

    @GetMapping(ApiConstants.COUNT_COMPETITION_STATE)
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "List of trackers was successfully loaded")
    })
    @Secured(value = {ApiConstants.ROLE_ORGANIZATION_ADMIN, ApiConstants.ROLE_TRAINER})
    public ResponseEntity<Long> countCompetitionState(
        @Parameter(description = "Competition id", example = "5") @PathVariable final Long id,
        @Parameter(description = "participant list id", example = "1,2,3") @RequestParam final Long participantId) {

        long trackersSize =
            locationTrackerService.countLastParticipantTrackersForCompetition(id, participantId);

        return ResponseEntity.ok(trackersSize);
    }
}
