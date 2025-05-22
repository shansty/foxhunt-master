package com.itechart.foxhunt.api.user.controller;

import com.itechart.foxhunt.api.auth.security.LoggedUserService;
import com.itechart.foxhunt.api.core.ApiConstants;
import com.itechart.foxhunt.api.core.OrganizationId;
import com.itechart.foxhunt.api.user.dto.UserFeedback;
import com.itechart.foxhunt.api.user.service.UserFeedbackService;
import com.itechart.foxhunt.domain.entity.UserEntity;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

//TODO move to the separate "service/folder"
@RestController
@RequestMapping(
    value = ApiConstants.USER_FEEDBACKS,
    produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class UserFeedbackController {

    private final UserFeedbackService userFeedbackService;

    private final LoggedUserService loggedUserService;

    @GetMapping
    @Secured(value = {ApiConstants.ROLE_TRAINER, ApiConstants.ROLE_PARTICIPANT})
    @Operation(summary = "Returns all logged user feedbacks in current organization")
    public ResponseEntity<List<UserFeedback>> getAll(@Parameter(hidden = true) OrganizationId organizationId) {
        UserEntity loggedUser = loggedUserService.getLoggedUserEntity();
        return ResponseEntity.ok(userFeedbackService.getAll(loggedUser, organizationId.getId()));
    }

    @PostMapping
    @Secured(value = {ApiConstants.ROLE_TRAINER, ApiConstants.ROLE_PARTICIPANT})
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Feedback was created"),
        @ApiResponse(responseCode = "404", description = "The user already has a feedback")
    })
    @Operation(summary = "Create feedback")
    public ResponseEntity<UserFeedback> create(@RequestBody final UserFeedback userFeedback,
                                               @Parameter(hidden = true) OrganizationId organizationId) {
        UserEntity loggedUser = loggedUserService.getLoggedUserEntity();
        Optional<UserFeedback> createdFeedback = userFeedbackService
            .create(userFeedback, loggedUser, organizationId.getId());

        return createdFeedback
            .map(feedback -> ResponseEntity.status(HttpStatus.CREATED).body(feedback))
            .orElseGet(() -> ResponseEntity.badRequest().build());
    }

    @PutMapping
    @Secured(value = {ApiConstants.ROLE_TRAINER, ApiConstants.ROLE_PARTICIPANT})
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "User feedback was updated"),
        @ApiResponse(responseCode = "404", description = "Feedback with this id does not exist"),
        @ApiResponse(responseCode = "409", description = "A user tries to update a feedback that is not his own")
    })
    @Operation(summary = "Update feedback", description = "Updates existing feedback")
    public ResponseEntity<UserFeedback> updateOne(@RequestBody final UserFeedback userFeedback,
                                                  @Parameter(hidden = true) OrganizationId organizationId) {
        UserEntity loggedUser = loggedUserService.getLoggedUserEntity();

        Optional<UserFeedback> updatedFeedback = userFeedbackService
            .updateOne(userFeedback, loggedUser, organizationId.getId());

        return updatedFeedback
            .map(feedback -> ResponseEntity.ok().body(feedback))
            .orElseGet(() -> ResponseEntity.status(HttpStatus.CONFLICT).build());
    }
}
