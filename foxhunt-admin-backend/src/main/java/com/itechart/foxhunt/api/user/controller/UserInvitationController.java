package com.itechart.foxhunt.api.user.controller;

import com.itechart.foxhunt.api.core.ApiConstants;
import com.itechart.foxhunt.api.user.dto.*;
import com.itechart.foxhunt.api.user.mapper.UserInvitationMapper;
import com.itechart.foxhunt.api.user.service.UserInvitationService;
import com.itechart.foxhunt.domain.enums.Role;
import com.itechart.foxhunt.domain.enums.UserInvitationStatus;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

//TODO are User invitations a separate functionality from User Details service/folder?
@RestController
@RequestMapping(ApiConstants.USER_INVITATIONS)
@RequiredArgsConstructor
@Slf4j
public class UserInvitationController {

    private final UserInvitationService userInvitationService;
    private final UserInvitationMapper userInvitationMapper;

    @GetMapping
    @Secured(ApiConstants.ROLE_SYSTEM_ADMIN)
    @ApiResponse(responseCode = "200", description = "List of user invitations")
    public ResponseEntity<List<UserInvitationShortDto>> getAll(Pageable pageable) {
        log.info("Received request to get all user invitations");
        List<UserInvitation> fetchedInvitations = userInvitationService.getAll(pageable);
        List<UserInvitationShortDto> result = fetchedInvitations.stream()
            .map(userInvitationMapper::convertToShortDto)
            .collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @PostMapping(ApiConstants.VERIFY)
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Invitation was proceed"),
        @ApiResponse(responseCode = "400", description = ApiConstants.BAD_INVITATION)
    })
    public ResponseEntity<UserInvitation> verify(@PathVariable(name = "orgDomain") String orgDomain,
                                                 @PathVariable(name = "status") String status,
                                                 @PathVariable(name = "token") String token) {
        UserInvitationStatus invitationStatus = UserInvitationStatus.valueOf(status.toUpperCase());
        final UserInvitation userInvitation = userInvitationService
            .processUserResponseOnInvitation(orgDomain, token, invitationStatus);
        log.info("User invitation with STATUS {} was proceed", userInvitation.getToken());
        return ResponseEntity.ok(userInvitation);
    }

    @PostMapping(ApiConstants.RESEND)
    public ResponseEntity<UserInvitationShortDto> resendInvitation(@PathVariable("id") Long invitationId) {
        log.info("Received request to resend invitation with ID {}", invitationId);
        UserInvitation resendResult = userInvitationService.resendInvitation(invitationId);
        return ResponseEntity.ok(userInvitationMapper.convertToShortDto(resendResult));
    }

    @PatchMapping(value = ApiConstants.DECLINE_REASON)
    public ResponseEntity<InvitationDeclineReason> setDeclineInvitationReason(@PathVariable("id") String invitationToken,
                                                                              @RequestBody @Valid InvitationDeclineReason declineReason) {
        log.info("Received request to set decline reason for user invitation with TOKEN: {}", invitationToken);
        InvitationDeclineReason savedDeclineReason = userInvitationService.setDeclineReason(invitationToken, declineReason);
        return ResponseEntity.ok(savedDeclineReason);
    }

    @PatchMapping(ApiConstants.DECLINE)
    @Secured(value = {ApiConstants.ROLE_SYSTEM_ADMIN})
    public ResponseEntity<Void> declineInvitation(@PathVariable("id") Long invitationId) {
        log.info("Received request to update invitation with ID {}", invitationId);
        userInvitationService.declineInvitation(invitationId);
        return ResponseEntity.ok().build();
    }

    @PostMapping(path = ApiConstants.ORGANIZATION_ADMIN)
    @Secured(value = {ApiConstants.ROLE_SYSTEM_ADMIN})
    public ResponseEntity<List<User>> inviteOrganizationAdmin(@RequestBody InviteUsersRequest inviteRequest) {
        Long organizationId = inviteRequest.getOrganization().getId();
        log.info("Received request to invite organization admin into organization with ID {}", organizationId);
        inviteRequest.setRoles(Set.of(Role.ORGANIZATION_ADMIN));
        List<User> invitedOrganizationAdmins = userInvitationService.inviteUsers(organizationId, inviteRequest)
            .stream().map(UserInvitation::getUser)
            .collect(Collectors.toList());
        return ResponseEntity.ok(invitedOrganizationAdmins);
    }

}
