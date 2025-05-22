package com.itechart.foxhunt.api.user.controller;

import com.itechart.foxhunt.api.auth.security.LoggedUserService;
import com.itechart.foxhunt.api.core.ApiConstants;
import com.itechart.foxhunt.api.core.OrganizationId;
import com.itechart.foxhunt.api.location.dto.UserShortDto;
import com.itechart.foxhunt.api.user.PasswordService;
import com.itechart.foxhunt.api.user.dto.ChangePasswordRequest;
import com.itechart.foxhunt.api.user.dto.GetUsersRequest;
import com.itechart.foxhunt.api.user.dto.InviteUsersRequest;
import com.itechart.foxhunt.api.user.dto.OrganizationUserRole;
import com.itechart.foxhunt.api.user.dto.OrganizationUserRoleShortDto;
import com.itechart.foxhunt.api.user.dto.ReactivationRolesRequest;
import com.itechart.foxhunt.api.user.dto.RegistrationUserInfo;
import com.itechart.foxhunt.api.user.dto.User;
import com.itechart.foxhunt.api.user.entity.ResetPasswordRequestEntity;
import com.itechart.foxhunt.api.user.mapper.UserMapper;
import com.itechart.foxhunt.api.user.service.OrganizationUserRoleService;
import com.itechart.foxhunt.api.user.service.UserInvitationService;
import com.itechart.foxhunt.api.user.service.UserService;
import com.itechart.foxhunt.domain.enums.Role;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;
import java.util.Set;

@RequiredArgsConstructor
@RestController
@RequestMapping(value = ApiConstants.USERS, produces = MediaType.APPLICATION_JSON_VALUE)
@Slf4j
public class UserControllerImpl implements UserController {

    private final UserService userService;

    private final UserInvitationService userInvitationService;

    private final OrganizationUserRoleService userRoleService;

    private final LoggedUserService loggedUserService;

    private final PasswordService passwordService;

    private final UserMapper userMapper;

    @GetMapping
    @Secured(value = {ApiConstants.ROLE_ORGANIZATION_ADMIN, ApiConstants.ROLE_TRAINER})
    @Override
    public List<User> getAllUsersInCurrentOrg(OrganizationId organizationId, GetUsersRequest request, Pageable pageable) {
        log.info("Received request to get all users in current organization. Current organization ID {}", organizationId);
        return userService.getAll(organizationId.getId(), request, pageable);
    }

    @GetMapping(params = {"organizationId"})
    @Secured(value = {ApiConstants.ROLE_SYSTEM_ADMIN})
    @Override
    public List<User> getAllUsersInOrg(GetUsersRequest request, Pageable pageable) {
        log.info("Received request to get all users for organization with ID {}", request.getOrganizationId());
        return userService.getAll(request.getOrganizationId(), request, pageable);
    }

    @GetMapping(ApiConstants.INFO)
    @Secured(value = {ApiConstants.ROLE_SYSTEM_ADMIN})
    @Override
    public List<User> findAllUsers(Pageable pageable) {
        log.info("Received request to find all users");
        return userService.findAll(pageable);
    }

    @GetMapping(params = {"id"})
    @Secured(value = {ApiConstants.ROLE_SYSTEM_ADMIN})
    @Override
    public List<UserShortDto> getUsersByFilterParams(GetUsersRequest request) {
        log.info("Received request to get users by ids: {}", request.getUserIds());
        return userService.getAllByIds(request.getUserIds()).stream()
            .map(userMapper::convertToShortDto)
            .toList();
    }

    @GetMapping(ApiConstants.ID)
    @Secured(value = {ApiConstants.ROLE_ORGANIZATION_ADMIN, ApiConstants.ROLE_TRAINER})
    @Override
    public User getUserById(@PathVariable Long id, OrganizationId organizationId) {
        log.info("Received request to get user with ID {} in organization with ID {}", id, organizationId);
        return userService.findById(id, organizationId.getId());
    }

    @GetMapping(ApiConstants.SIZE)
    @Secured(value = {ApiConstants.ROLE_ORGANIZATION_ADMIN, ApiConstants.ROLE_TRAINER})
    @Override
    public long countAll(OrganizationId organizationId) {
        log.info("Received request to get number of users in organization with ID {}", organizationId);
        return userService.countAll(organizationId.getId());
    }

    @GetMapping(value = ApiConstants.ADMIN)
    @Secured(value = {ApiConstants.ROLE_ORGANIZATION_ADMIN, ApiConstants.ROLE_TRAINER, ApiConstants.ROLE_PARTICIPANT, ApiConstants.ROLE_SYSTEM_ADMIN})
    @Override
    public User getAdminInCurrentOrg(OrganizationId organizationId) {
        log.info("Received request to get organization admin by organization id {}", organizationId.getId());
        return userService.findAdminByOrganizationId(organizationId.getId());
    }

    @GetMapping(value = ApiConstants.ADMIN, params = "organizationId")
    @Secured(value = {ApiConstants.ROLE_SYSTEM_ADMIN})
    @Override
    public User getAdminByOrganizationId(Long organizationId) {
        log.info("Received request to get organization admin by organization id {}", organizationId);
        return userService.findAdminByOrganizationId(organizationId);
    }

    //TODO shouldn't it be a part of UserInvitationController?
    @PostMapping
    @Secured(value = {ApiConstants.ROLE_ORGANIZATION_ADMIN, ApiConstants.ROLE_TRAINER})
    @Override
    public ResponseEntity<Void> inviteUsers(@RequestBody InviteUsersRequest inviteRequest,
                                            OrganizationId organizationId) {
        if (isSendingInvitationForbidden(inviteRequest.getRoles())) {
            String msg = "Current user can't invite users with provided roles.";
            log.info(msg);
            throw new AccessDeniedException(msg, null);
        }

        log.info("Received request to invite users with emails {} into organization with ID {}", inviteRequest.getEmails(), organizationId);
        userInvitationService.inviteUsers(organizationId.getId(), inviteRequest);
        return ResponseEntity.ok().build();
    }

    private boolean isSendingInvitationForbidden(Set<Role> invitationRoles) {
        return invitationRoles.contains(Role.ORGANIZATION_ADMIN) ||
            (invitationRoles.contains(Role.TRAINER) && !loggedUserService.retrieveLoggedUserRoles().contains(Role.ORGANIZATION_ADMIN));
    }

    @GetMapping(ApiConstants.CURRENT_USER)
    @Override
    public ResponseEntity<User> getLoggedUserInfo() {
        log.info("Received request to get logged user info");
        User loggedUser = loggedUserService.getLoggedUser();
        return ResponseEntity.ok(loggedUser);
    }

    @PatchMapping(ApiConstants.DEACTIVATE_USER)
    @Secured(value = {ApiConstants.ROLE_ORGANIZATION_ADMIN, ApiConstants.ROLE_TRAINER})
    @Override
    public ResponseEntity<Void> deactivateUser(@PathVariable(value = "id") Long userId, OrganizationId organizationId) {
        log.info("Received request to deactivate user with id={} in organization with id={}.", userId, organizationId);
        userService.deactivate(loggedUserService.getLoggedUser(), userId, organizationId.getId());
        return ResponseEntity.ok().build();
    }

    @PostMapping(ApiConstants.REACTIVATE_USER)
    @Secured(value = {ApiConstants.ROLE_ORGANIZATION_ADMIN, ApiConstants.ROLE_TRAINER})
    @Override
    public ResponseEntity<Void> reactivateUser(@PathVariable(value = "id") Long userId, OrganizationId organizationId,
                                               @RequestBody @Valid ReactivationRolesRequest reactivationRolesRequest) {
        log.info("Received request to reactivate user with id={} in organization with id={}.", userId, organizationId);
        userInvitationService.inviteDeactivatedUser(loggedUserService.getLoggedUser(), userId, organizationId.getId(),
            reactivationRolesRequest.getRoles());
        return ResponseEntity.ok().build();
    }

    @PatchMapping
    @Secured(value = {ApiConstants.ROLE_ORGANIZATION_ADMIN, ApiConstants.ROLE_TRAINER})
    @Override
    public ResponseEntity<User> updateOne(@RequestBody User updatedUser,
                                          OrganizationId organizationId) {
        log.info("Received request to update user with ID {} in organization with ID {}", updatedUser.getId(), organizationId);
        User loggedUser = loggedUserService.getLoggedUser();
        return ResponseEntity.ok(userService.update(updatedUser, organizationId.getId(), loggedUser));
    }

    @PatchMapping(ApiConstants.ID)
    @Secured(value = ApiConstants.ROLE_SYSTEM_ADMIN)
    @Override
    public ResponseEntity<Void> manageBanStatus(@PathVariable(value = "id") Long userId) {
        log.info("Received request to manage ban status of user with id={}", userId);
        userService.manageBanStatus(userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping(ApiConstants.REGISTRATION_INFO)
    @Override
    public ResponseEntity<User> setRegistrationUserInfo(@RequestBody RegistrationUserInfo userInfo) {
        log.info("Received request to setup registration info from User with EMAIL: {}", userInfo.getEmail());
        User registeredUser = userService.setRegistrationUserInfo(userInfo);
        log.info("Registration info set for User with EMAIL: {}. Moving to organization activation", userInfo.getEmail());
        return ResponseEntity.ok(registeredUser);
    }

    @PostMapping(ApiConstants.FORGOT_PASSWORD)
    @Override
    public ResponseEntity<?> processForgetPasswordRequest(@RequestBody User user) {
        log.info("Received forgot password request from User with EMAIL: {}", user.getEmail());
        passwordService.processForgotPasswordRequest(user);
        return ResponseEntity.ok().build();
    }

    @PostMapping(ApiConstants.RESET_PASSWORD_LINK)
    @Override
    public ResponseEntity<ResetPasswordRequestEntity> validateResetPasswordRequest(
        @PathVariable(name = "token") String token) {
        final ResetPasswordRequestEntity resetPasswordRequestEntity = passwordService
            .processResetPasswordRequest(token);
        log.info("Reset password request was proceed: {}", resetPasswordRequestEntity.toString());
        return ResponseEntity.ok(resetPasswordRequestEntity);
    }

    @PostMapping(ApiConstants.PASSWORD)
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Password has been reset"),
        @ApiResponse(responseCode = "400", description = "Bad reset password request")
    })
    public ResponseEntity<User> updatePasswordAfterReset(@RequestBody User userDto,
                                                         @RequestParam String token) {
        log.info("Received request to update password after reset for User with EMAIL: {}", userDto.getEmail());
        User updatedUser = userService.resetPassword(userDto, token);
        return ResponseEntity.ok(updatedUser);
    }

    @PatchMapping(ApiConstants.CHANGE_PASSWORD)
    @Override
    public ResponseEntity<User> changePassword(@RequestBody ChangePasswordRequest changePasswordRequest) {
        User updatedUser = userService.changePassword(loggedUserService.getLoggedUser(), changePasswordRequest);
        return ResponseEntity.ok(updatedUser);
    }

    @PutMapping(ApiConstants.ORGANIZATION_ADMIN)
    @Secured(ApiConstants.ROLE_SYSTEM_ADMIN)
    @Override
    public ResponseEntity<OrganizationUserRole> changeOrganizationAdmin(@RequestBody OrganizationUserRoleShortDto userRole) {
        log.info("Received request to change organization admin to user with ID {} in organization {}",
            userRole.getUserId(), userRole.getOrganizationId());
        OrganizationUserRole organizationUserRole =
            userRoleService.changeOrganizationAdmin(userRole.getOrganizationId(), userRole.getUserId());
        return ResponseEntity.ok(organizationUserRole);
    }

}
