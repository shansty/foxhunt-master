package com.itechart.foxhunt.api.user.controller;

import com.itechart.foxhunt.api.core.ApiConstants;
import com.itechart.foxhunt.api.core.OrganizationId;
import com.itechart.foxhunt.api.location.dto.UserShortDto;
import com.itechart.foxhunt.api.user.config.UserDocConstants;
import com.itechart.foxhunt.api.user.dto.*;
import com.itechart.foxhunt.api.user.entity.ResetPasswordRequestEntity;
import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springdoc.api.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

public interface UserController {

    @Operation(summary = "Returns all users in current organization with pagination")
    @ApiResponse(
        responseCode = "200",
        content = @Content(examples = @ExampleObject(value = UserDocConstants.GET_ALL_USERS_RESPONSE)))
    List<User> getAllUsersInCurrentOrg(@Parameter(hidden = true) OrganizationId organizationId,
                                       @ParameterObject GetUsersRequest request,
                                       @ParameterObject Pageable pageable);

    @Hidden
    List<User> getAllUsersInOrg(@ParameterObject GetUsersRequest request,
                                @ParameterObject Pageable pageable);

    @Operation(summary = "Returns all users with pagination")
    @ApiResponse(responseCode = "200", description = "Users with pagination")
    List<User> findAllUsers(@ParameterObject Pageable pageable);

    @Hidden
    List<UserShortDto> getUsersByFilterParams(@ParameterObject GetUsersRequest request);

    @Operation(summary = "Returns user by id")
    @ApiResponse(
        responseCode = "200", description = "User found",
        content = @Content(examples = @ExampleObject(UserDocConstants.SINGLE_USER))
    )
    User getUserById(@PathVariable Long id,
                     @Parameter(hidden = true) OrganizationId organizationId);

    @Operation(summary = "Returns number of users in current organization")
    long countAll(@Parameter(hidden = true) OrganizationId organizationId);

    @Operation(summary = "Returns admin of current organization")
    @ApiResponse(
        responseCode = "200", description = "Admin found",
        content = @Content(examples = @ExampleObject(UserDocConstants.SINGLE_USER))
    )
    User getAdminInCurrentOrg(@Parameter(hidden = true) OrganizationId organizationId);

    @Operation(summary = "Returns organization admin by provided organization id")
    @ApiResponse(
        responseCode = "200", description = "Organization admin found",
        content = @Content(examples = @ExampleObject(UserDocConstants.SINGLE_USER))
    )
    User getAdminByOrganizationId(@Parameter(description = "Can be used only by System Admin") Long organizationId);

    @Operation(summary = "Invites users by list of provided emails")
    ResponseEntity<Void> inviteUsers(
        @RequestBody(content = @Content(examples = @ExampleObject(UserDocConstants.INVITE_USERS_REQUEST)))
        InviteUsersRequest inviteRequest,
        @Parameter(hidden = true) OrganizationId organizationId);

    @Operation(summary = "Returns logged user")
    @ApiResponse(
        responseCode = "200", description = "Logged user found",
        content = @Content(examples = @ExampleObject(UserDocConstants.SINGLE_USER))
    )
    ResponseEntity<User> getLoggedUserInfo();

    @Operation(summary = "Deactivating user in the organization")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "All active user's roles have been switched to inactive successfully"),
        @ApiResponse(responseCode = "400", description = "Inactive user can't be deactivated", content = @Content),
        @ApiResponse(responseCode = "403", description = "User doesn't have permissions to deactivate another user", content = @Content),
    })
    ResponseEntity<Void> deactivateUser(Long userId,
                                        @Parameter(hidden = true) OrganizationId organizationId);

    @Operation(summary = "Inviting deactivated user in the organization")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Invitation was sent to a deactivated user"),
        @ApiResponse(responseCode = "400", description = "Inactive user can't be invited as deactivated", content = @Content),
        @ApiResponse(responseCode = "403", description = "User doesn't have permissions to invite deactivated user", content = @Content),
    })
    ResponseEntity<Void> reactivateUser(Long userId,
                                        @Parameter(hidden = true) OrganizationId organizationId,
                                        @RequestBody ReactivationRolesRequest reactivationRolesRequest);

    @Operation(summary = "Updates user")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "User updated successfully"),
        @ApiResponse(responseCode = "400", description = "User update error", content = @Content),
    })
    ResponseEntity<User> updateOne(
        @RequestBody(content = @Content(examples = @ExampleObject(UserDocConstants.SINGLE_USER)))
        User updatedUser,
        @Parameter(hidden = true) OrganizationId organizationId);

    @Operation(summary = "Manages ban status of user")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Ban status was changed successfully"),
        @ApiResponse(responseCode = "404", description = "User was not found", content = @Content),
    })
    ResponseEntity<Void> manageBanStatus(@PathVariable Long userId);

    @Operation(summary = "Setup registration user info")
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200", description = "Registration info was saved successfully",
            content = @Content(examples = @ExampleObject(UserDocConstants.SETUP_REGISTRATION_INFO_RESPONSE))
        ),
        @ApiResponse(responseCode = "400", description = ApiConstants.BAD_INVITATION, content = @Content),
    })
    ResponseEntity<User> setRegistrationUserInfo(
        @RequestBody(content = @Content(examples = @ExampleObject(UserDocConstants.SETUP_REGISTRATION_INFO_REQUEST)))
        RegistrationUserInfo userInfo);

    @Operation(summary = "Sends reset link to provided email")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Forgot password request was proceed"),
        @ApiResponse(responseCode = "400", description = "Bad forgot password request", content = @Content),
        @ApiResponse(responseCode = "409", description = "Error while sending email", content = @Content),
    })
    ResponseEntity<?> processForgetPasswordRequest(
        @RequestBody(content = @Content(examples = @ExampleObject(UserDocConstants.FORGOT_PASSWORD_REQUEST)))
        User user);

    @Operation(summary = "Validates reset password request")
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Reset password request was proceed",
            content = @Content(examples = @ExampleObject(UserDocConstants.VALIDATE_RESET_PASSWORD_RESPONSE))),
        @ApiResponse(responseCode = "400", description = "Bad reset password request", content = @Content),
    })
    ResponseEntity<ResetPasswordRequestEntity> validateResetPasswordRequest(@Parameter String token);

    @Operation(summary = "Updated user password after reset")
    ResponseEntity<User> updatePasswordAfterReset(
        @RequestBody(content = @Content(examples = @ExampleObject(UserDocConstants.UPDATE_PASSWORD_AFTER_RESET_REQUEST)))
        User userDto,
        @Parameter String token);

    @Operation(summary = "Changes current user password")
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Password was changed successfully",
            content = @Content(examples = @ExampleObject(UserDocConstants.SINGLE_USER))),
        @ApiResponse(responseCode = "400", description = "Bad change password request", content = @Content),
    })
    ResponseEntity<User> changePassword(@RequestBody ChangePasswordRequest changePasswordRequest);

    @Operation(summary = "Changes admin in provided organization")
    @ApiResponse(
        responseCode = "200", description = "Organization admin was changed successfully",
        content = @Content(examples = @ExampleObject(UserDocConstants.CHANGE_ORGANIZATION_ADMIN_RESPONSE))
    )
    ResponseEntity<OrganizationUserRole> changeOrganizationAdmin(
        @RequestBody(content = @Content(examples = @ExampleObject(value = UserDocConstants.CHANGE_ORGANIZATION_ADMIN_REQUEST)))
        OrganizationUserRoleShortDto userRole);
}
