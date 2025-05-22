package com.itechart.foxhunt.api.competition.controller;

import com.itechart.foxhunt.api.competition.config.CompetitionDocConstants;
import com.itechart.foxhunt.api.competition.dto.CancelCompetitionRequest;
import com.itechart.foxhunt.api.competition.dto.Competition;
import com.itechart.foxhunt.api.competition.dto.CompetitionInvitation;
import com.itechart.foxhunt.api.competition.dto.GetAllCompetitionsRequest;
import com.itechart.foxhunt.api.competition.dto.ModifyCompetition;
import com.itechart.foxhunt.api.competition.dto.PersonalUserResult;
import com.itechart.foxhunt.api.core.OrganizationId;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springdoc.api.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;

import javax.validation.Valid;
import java.util.List;

public interface CompetitionControllerInterface {

    @Operation(summary = "Returns all competitions in current organization")
    @ApiResponse(
        responseCode = "200",
        content = @Content(examples = {
            @ExampleObject(CompetitionDocConstants.GET_ALL_COMPETITIONS_RESPONSE)
        }))
    Page<? extends Competition> findAllAvailable(@Valid GetAllCompetitionsRequest competitionsRequest,
                                                 @ParameterObject Pageable pageable,
                                                 @Parameter(hidden = true) OrganizationId organizationId);

    @Operation(summary = "Returns all invitations by competition with provided id")
    List<CompetitionInvitation> getAllInvitationsByCompetitionId(@Parameter(hidden = true) OrganizationId organizationId,
                                                                 final Long id);

    @Operation(summary = "Returns competition by provided id")
    @ApiResponse(
        responseCode = "200",
        content = @Content(examples = {
            @ExampleObject(CompetitionDocConstants.SINGLE_COMPETITION)
        }))
    Object getById(final Long id,
                   @ParameterObject OrganizationId organizationId);

    @Operation(summary = "Returns all competitions results in current organization")
    ResponseEntity<Page<PersonalUserResult>> getUserResults(@Parameter(hidden = true) OrganizationId organizationId,
                                                            @ParameterObject Pageable pageable);

    @Operation(summary = "Creates new competition")
    ResponseEntity<Competition> create(
        @RequestBody(content = @Content(examples = {
            @ExampleObject(CompetitionDocConstants.MODIFY_COMPETITION_REQUEST)
        })) final ModifyCompetition competition,
        @Parameter(hidden = true) OrganizationId organizationId);

    @Operation(
        summary = "Subscribe to a competition",
        description = "Adds a participant to a public scheduled competition or creates join request to a private one"
    )
    ResponseEntity<?> subscribe(Long competitionId,
                                @Parameter Long participantId,
                                @Parameter(hidden = true) OrganizationId organizationId);

    @Operation(summary = "Accept an invitation to a competition")
    ResponseEntity<CompetitionInvitation> acceptInvitation(final Long competitionId,
                                                           @Parameter Long participantId,
                                                           @Parameter(hidden = true) OrganizationId organizationId);

    @Operation(summary = "Decline an invitation to a competition")
    ResponseEntity<CompetitionInvitation> declineInvitation(@PathVariable("id") final Long competitionId,
                                                            @Parameter Long participantId);

    @Operation(summary = "Blocks user from participation in provided competition")
    ResponseEntity<CompetitionInvitation> declineInvitationPermanently(@PathVariable("id") final Long competitionId,
                                                                       @Parameter Long participantId,
                                                                       @Parameter(hidden = true) OrganizationId organizationId);

    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Competition was updated"),
        @ApiResponse(responseCode = "400", description = "No resource within organization"),
        @ApiResponse(responseCode = "409", description = "Error due to change state different from SCHEDULED")
    })
    @Operation(summary = "Update competition", description = "Updates existing competition")
    ResponseEntity<Competition> updateOne(
        @RequestBody(content = @Content(examples = {
            @ExampleObject(CompetitionDocConstants.MODIFY_COMPETITION_REQUEST)
        }))
        ModifyCompetition competition,
        @Parameter(description = "Competition id", example = "5") final Long id, OrganizationId organizationId);

    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Competition was canceled"),
        @ApiResponse(responseCode = "409", description = "Error due to change state different from SCHEDULED")
    })
    @Operation(summary = "Cancel competition")
    ResponseEntity<Competition> cancelOne(@Valid CancelCompetitionRequest cancelRequest,
                                          @Parameter(description = "Competition id", example = "5")
                                          Long id,
                                          @Parameter(hidden = true) OrganizationId organizationId);

    @Operation(summary = "Deletes competition")
    ResponseEntity<Long> deleteOne(@PathVariable final Long id,
                                   @Parameter(hidden = true) OrganizationId organizationId);

    @Operation(summary = "Drop participant out of competition")
    ResponseEntity<Long> removeParticipantFromCompetition(@PathVariable final Long id,
                                                          @Parameter final Long participantId,
                                                          @Parameter(hidden = true) OrganizationId organizationId);
}
