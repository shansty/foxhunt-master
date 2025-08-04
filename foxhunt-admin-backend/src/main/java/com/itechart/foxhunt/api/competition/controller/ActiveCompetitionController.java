package com.itechart.foxhunt.api.competition.controller;

import com.itechart.foxhunt.api.auth.security.LoggedUserService;
import com.itechart.foxhunt.api.competition.CompetitionUtils;
import com.itechart.foxhunt.api.competition.dto.*;
import com.itechart.foxhunt.api.competition.service.ActiveCompetitionService;
import com.itechart.foxhunt.api.competition.service.CompetitionResultService;
import com.itechart.foxhunt.api.competition.service.LocationTrackerService;
import com.itechart.foxhunt.api.core.OrganizationId;
import com.itechart.foxhunt.api.exception.globalhandler.WebExceptionHandler;
import com.itechart.foxhunt.api.user.dto.UserResult;
import com.itechart.foxhunt.domain.entity.UserEntity;
import com.itechart.foxhunt.domain.enums.NotificationType;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import javax.validation.Valid;
import java.io.IOException;
import java.util.List;

import static com.itechart.foxhunt.api.core.ApiConstants.*;

@RestController
@RequestMapping(value = ACTIVE_COMPETITIONS, produces = MediaType.APPLICATION_JSON_VALUE)
@AllArgsConstructor
@Slf4j
@Transactional
public class ActiveCompetitionController {

    public static final String FOX_POINTS_FORMAT = "\"[ { \"index\": 1, \"label\": \"F1\", \"coordinates\": { \"type\": \"Point\", \"coordinates\": [ 53.906, 27.571 ] } }, ... ] \"";

    public static final int DEFAULT_TRACKER_QUANTITY = 5;

    private final long SSE_SESSION_TIMEOUT = 1000 * 60 * 10; //10 min

    private final ActiveCompetitionService activeCompetitionService;

    private final LoggedUserService loggedUserService;

    private final LocationTrackerService locationTrackerService;

    private final CompetitionResultService competitionResultService;

    @GetMapping(path = SUBSCRIBE_COMPETITION, produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Subscribed to a competition and location tracker events")
    })
    @Operation(summary = "Subscribe to a competition", description = "Adds a subscriber to a competition")
    public ResponseEntity<SseEmitter> subscribe(@Parameter(description = "Competition id", example = "5")
                                                @PathVariable("id") final Long competitionId,
                                                OrganizationId organizationId) throws IOException {
        UserEntity subscriber = loggedUserService.getLoggedUserEntity();

        activeCompetitionService.completeCurrentEmitter(subscriber);

        final SseEmitter client = new SseEmitter(SSE_SESSION_TIMEOUT);

        try {
            activeCompetitionService.subscribeToCompetition(competitionId, client, subscriber, organizationId.getId());
            locationTrackerService.subscribeToLocationNotification(competitionId, client);
        } catch (Exception e) {
            // Sending error message
            log.error(WebExceptionHandler.ERROR_MESSAGE, e.getLocalizedMessage());
            client.send(SseEmitter.event()
                .name(NotificationType.ERROR.name())
                .data(e.getLocalizedMessage()));
            client.complete();
        }

        // Http status 200 relates to a connection, but not to business logic
        return new ResponseEntity<>(client, HttpStatus.OK);
    }

    @DeleteMapping(SUBSCRIPTION)
    public ResponseEntity<?> deleteSubscription() {
        UserEntity subscriber = loggedUserService.getLoggedUserEntity();

        activeCompetitionService.completeCurrentEmitter(subscriber);
        return ResponseEntity.ok().build();
    }

    @PatchMapping(START)
    @Transactional
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Competition and location event trackers were started"),
        @ApiResponse(responseCode = "409", description = "Error due to attempt start before 15 minutes or to change state different from SCHEDULED"),
        @ApiResponse(responseCode = "409", description = "Error due to change state different from SCHEDULED")
    })
    @Operation(summary = "Start competition", description = "Changes state of competition to RUNNING and add fox coordinates")
    @Secured(value = {ROLE_ORGANIZATION_ADMIN, ROLE_TRAINER})
    public ResponseEntity<Competition> startOne(
        @Parameter(description = "Competition id", example = "5") @PathVariable final Long id,
        @Parameter(description = "foxPoints and participants. foxPoints in format " + FOX_POINTS_FORMAT)
        @Valid @RequestBody StartCompetition startCompetition,
        OrganizationId organizationId) {

        locationTrackerService.startById(id, startCompetition.getParticipants());
        return ResponseEntity
            .ok(activeCompetitionService.startById(id, startCompetition.getFoxPoints(),
                startCompetition.getParticipants(), organizationId.getId()));
    }

    @PatchMapping(FINISH)
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Competition and location event trackers were finished"),
        @ApiResponse(responseCode = "409", description = "Error due to change state different from RUNNING")})
    @Secured(value = {ROLE_ORGANIZATION_ADMIN, ROLE_TRAINER})
    public ResponseEntity<Competition> finishOne(
        @Parameter(description = "Competition id", example = "5") @PathVariable final Long id,
        @RequestBody final ReasonToStop reasonToStop, OrganizationId organizationId) {
        locationTrackerService.finishById(id);
        return ResponseEntity
            .ok(activeCompetitionService.finishById(id, reasonToStop.getReasonToStop(),
                organizationId.getId()));
    }

    @PostMapping(TRACK_DEVICE)
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Fox point that was visited " + FOX_POINTS_FORMAT)
    })
    public ResponseEntity<TrackDeviceResponse> trackDevice(
        @Parameter(description = "Competition id", example = "5")
        @PathVariable final Long id,
        @Valid @RequestBody DeviceInfo deviceInfo) {

        TrackDeviceResponse response = new TrackDeviceResponse();

        ActiveFoxInfo activeFoxInfo = activeCompetitionService.getActiveFoxInfo(id);

        final ActiveTracker activeTracker = ActiveTracker.builder()
            .activeFoxInfo(activeFoxInfo)
            .currentLocation(deviceInfo.getCoordinates())
            .participantId(loggedUserService.getLoggedUserEntity().getId())
            .competitionId(id)
            .build();

        locationTrackerService.saveActiveTracker(activeTracker);

        if (competitionResultService.isUserOutsidePolygon(activeTracker)) {
            response.setNotificationType(NotificationType.USER_IS_OUT_OF_POLYGON);
            return ResponseEntity.ok(response);
        }

        if (competitionResultService.isUserVisitFinishPoint(activeTracker)) {
            competitionResultService.participantFinish(activeTracker);
            response.setNotificationType(NotificationType.PARTICIPANT_FINISH);

            return ResponseEntity.ok(response);
        }

        FoxPoint foundFox = competitionResultService.updateCompetitionResults(activeTracker);

        if (foundFox != null) {
            response.setNotificationType(NotificationType.FOX_FOUND);
            response.setFoxPoint(foundFox);
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping(PARTICIPANT_FINISH)
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Competition was finished successfully"),
        @ApiResponse(responseCode = "400", description = "Competition with id %s already finished")
    })
    public ResponseEntity<Void> participantFinish(@Parameter(description = "Competition id", example = "5")
                                                  @PathVariable final Long id,
                                                  @Valid @RequestBody DeviceInfo deviceInfo) {

        final ActiveTracker activeTracker = ActiveTracker.builder()
            .currentLocation(deviceInfo.getCoordinates())
            .participantId(loggedUserService.getLoggedUserEntity().getId())
            .competitionId(id)
            .build();

        competitionResultService.participantFinish(activeTracker);

        return ResponseEntity.ok().build();
    }

    @GetMapping(ID)
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Competition with id %s was finished successfully"),
        @ApiResponse(responseCode = "400", description = "Competition with id %s already finished")
    })
    public ResponseEntity<GameStateResponse> getCompetitionState(
        @Parameter(description = "Competition id", example = "5")
        @PathVariable final Long id,
        @RequestParam(required = false) final boolean replay) {

        List<UserResult> userResultList = competitionResultService.getUsersResult(id);

        if (replay) {
            return ResponseEntity.ok(GameStateResponse.builder()
                .results(userResultList)
                .build());
        }
        ActiveCompetition activeCompetition = activeCompetitionService.getActiveCompetitionInfo(id);
        List<ActiveTracker> activeTrackers = locationTrackerService
            .getLastParticipantTrackersForCompetition(id,
                DEFAULT_TRACKER_QUANTITY);

        return ResponseEntity.ok(GameStateResponse.builder()
            .activeCompetition(activeCompetition)
            .participantTrackers(
                CompetitionUtils.activeTrackersToParticipantTrackerList(activeTrackers))
            .results(userResultList)
            .build());
    }

    @GetMapping(ACTIVE)
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Active competition for current user was found"),
        @ApiResponse(responseCode = "409", description = "Error due to found active competition")
    })
    @Secured(value = {ROLE_PARTICIPANT})
    public ResponseEntity<List<Competition>> getActiveCompetitions(OrganizationId organizationId) {
        Long userId = loggedUserService.getLoggedUserEntity().getId();
        return ResponseEntity.ok(activeCompetitionService.getActiveCompetitions(
            userId, organizationId.getId()));
    }

    @GetMapping(ACTIVE_BY_ID)
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Active competition for current user was found"),
        @ApiResponse(responseCode = "409", description = "Error due to found active competition")
    })
    @Secured(value = {ROLE_PARTICIPANT})
    public ResponseEntity<Competition> getActiveCompetitionById(
        OrganizationId organizationId,
        @PathVariable final Long id) {
        Long userId = loggedUserService.getLoggedUserEntity().getId();
        return ResponseEntity.ok(activeCompetitionService.getActiveCompetitionById(
            userId, organizationId.getId(), id));
    }
}
