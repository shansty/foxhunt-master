package com.itechart.foxhunt.api.user.controller;

import com.itechart.foxhunt.api.auth.security.AuthorizationService;
import com.itechart.foxhunt.api.auth.security.LoggedUserService;
import com.itechart.foxhunt.api.core.OrganizationId;
import com.itechart.foxhunt.api.exception.UserNotFoundException;
import com.itechart.foxhunt.api.location.dto.UserShortDto;
import com.itechart.foxhunt.api.location.mapper.ForbiddenAreaMapperImpl;
import com.itechart.foxhunt.api.location.mapper.LocationMapperImpl;
import com.itechart.foxhunt.api.organization.OrganizationService;
import com.itechart.foxhunt.api.user.PasswordService;
import com.itechart.foxhunt.api.user.dto.GetUsersRequest;
import com.itechart.foxhunt.api.user.dto.InviteUsersRequest;
import com.itechart.foxhunt.api.user.dto.OrganizationUserRole;
import com.itechart.foxhunt.api.user.dto.OrganizationUserRoleShortDto;
import com.itechart.foxhunt.api.user.dto.ReactivationRolesRequest;
import com.itechart.foxhunt.api.user.dto.User;
import com.itechart.foxhunt.api.user.mapper.UserMapper;
import com.itechart.foxhunt.api.user.mapper.UserMapperImpl;
import com.itechart.foxhunt.api.user.service.OrganizationUserRoleService;
import com.itechart.foxhunt.api.user.service.UserInvitationService;
import com.itechart.foxhunt.api.user.service.UserService;
import com.itechart.foxhunt.api.user.util.UserTestUtils;
import com.itechart.foxhunt.domain.entity.RoleEntity;
import com.itechart.foxhunt.domain.enums.Role;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import javax.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Set;

import static com.itechart.foxhunt.api.TestDataKeeper.ORGANIZATION_ID;
import static com.itechart.foxhunt.api.TestDataKeeper.USER_ID;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anySet;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith({MockitoExtension.class, SpringExtension.class})
@ContextConfiguration(classes = {
    LocationMapperImpl.class, ForbiddenAreaMapperImpl.class, UserMapperImpl.class, UserControllerImpl.class
})
public class UserControllerTest {

    @MockBean
    UserService userService;

    @MockBean
    UserInvitationService userInvitationService;

    @MockBean
    PasswordService passwordService;

    @MockBean
    OrganizationService organizationService;

    @MockBean
    AuthorizationService authorizationService;

    @MockBean
    LoggedUserService loggedUserService;

    @MockBean
    OrganizationUserRoleService userRoleService;

    @Autowired
    UserMapper userMapper;

    @Autowired
    UserControllerImpl userController;

    @Test
    void expectReturnsAllUsers() {
        //given
        OrganizationId organizationId = new OrganizationId(1L);
        GetUsersRequest getUsersRequest = new GetUsersRequest();
        User userToReturn = UserTestUtils.getUser();
        List<User> expectedReturnedUsers = List.of(userToReturn);
        Pageable pageable = PageRequest.of(0, 10);

        //when
        when(userService.getAll(organizationId.getId(), getUsersRequest, pageable)).thenReturn(List.of(UserTestUtils.getUser()));

        //then
        List<User> returnedUsers = userController.getAllUsersInCurrentOrg(organizationId, getUsersRequest, pageable);
        assertEquals(expectedReturnedUsers, returnedUsers);
    }

    @Test
    void expectReturnsUserByIdWhenUserAssociatedWithProvidedOrganization() {
        //given
        User expectedReturnedUser = UserTestUtils.getUser();
        OrganizationId organizationId = new OrganizationId(1L);
        Long userId = 1L;

        //when
        when(userService.findById(userId, organizationId.getId())).thenReturn(UserTestUtils.getUser());

        //then
        User returnedUser = userController.getUserById(userId, organizationId);
        assertEquals(expectedReturnedUser, returnedUser);
    }

    @Test
    void expectEntityNotFoundExceptionWhenUserNotAssociatedWithProvidedOrganization() {
        //given
        OrganizationId organizationId = new OrganizationId(1L);
        Long userId = 1L;

        //when
        when(userService.findById(userId, organizationId.getId())).thenThrow(new EntityNotFoundException());

        //then
        assertThrows(EntityNotFoundException.class, () -> userController.getUserById(userId, organizationId));
    }

    @Test
    void expectReturnsNumberOfUsersAssociatedWithProvidedOrganization() {
        //given
        OrganizationId organizationId = new OrganizationId(1L);
        long expectedNumberOfUsers = 64L;

        //when
        when(userService.countAll(organizationId.getId())).thenReturn(expectedNumberOfUsers);

        //then
        long numberOfUsers = userController.countAll(organizationId);
        assertEquals(expectedNumberOfUsers, numberOfUsers);
    }

    @Test
    void expectInvitesUsersWithProvidedEmailsAndWithProvidedRole() {
        //given
        OrganizationId organizationId = new OrganizationId(1L);
        Set<String> usersEmails = Set.of("defaultemail1@gmail.com", "defaultemail2@gmail.com", "defaultemail3@gmail.com");
        Role invitationRole = Role.PARTICIPANT;

        InviteUsersRequest inviteRequest = new InviteUsersRequest();
        inviteRequest.setEmails(usersEmails);
        inviteRequest.setRoles(Set.of(invitationRole));

        //when
        userController.inviteUsers(inviteRequest, organizationId);

        //then
        verify(userInvitationService).inviteUsers(organizationId.getId(), inviteRequest);
    }

    @Test
    void expectReturnsLoggedUser() {
        //given
        User expectedLoggedUser = UserTestUtils.getUser();
        OrganizationUserRoleShortDto userRole = new OrganizationUserRoleShortDto();
        userRole.setOrganizationId(1L);
        userRole.setUserId(expectedLoggedUser.getId());
        userRole.setRole(Role.ORGANIZATION_ADMIN);

        expectedLoggedUser.setRoles(Set.of(userRole));

        //when
        when(loggedUserService.getLoggedUser()).thenReturn(expectedLoggedUser);

        //then
        ResponseEntity<User> loggedUserResponse = userController.getLoggedUserInfo();
        assertEquals(ResponseEntity.ok(expectedLoggedUser), loggedUserResponse);
    }

    @Test
    void expectUserNotFoundExceptionWhenAttemptToGetLoggedUserInfoAndUserNotAuthenticated() {
        //given

        //when
        when(loggedUserService.getLoggedUser()).thenThrow(new UserNotFoundException());

        //then
        assertThrows(UserNotFoundException.class, () -> userController.getLoggedUserInfo());
    }

    @Test
    void expectUserNotFoundExceptionWhenAttemptToGetLoggedUserOrganizationDomainsAndUserNotAuthenticated() {
        //given

        //when
        when(loggedUserService.getLoggedUser()).thenThrow(new UserNotFoundException());

        //then
        assertThrows(UserNotFoundException.class, () -> userController.getLoggedUserInfo());
    }

    @Test
    void shouldDeactivateUserSuccessfully() {
        //given
        OrganizationId organizationId = new OrganizationId(ORGANIZATION_ID);
        User loggedUser = UserTestUtils.getUser();

        //when
        when(loggedUserService.getLoggedUser()).thenReturn(loggedUser);
        doNothing().when(userService).deactivate(any(), any(), any());

        //then
        ResponseEntity<Void> response = userController.deactivateUser(USER_ID, organizationId);
        assertEquals(ResponseEntity.ok().build(), response);
        verify(userService).deactivate(loggedUser, USER_ID, organizationId.getId());
    }

    @Test
    void shouldReactivateUserSuccessfully() {
        //given
        OrganizationId organizationId = new OrganizationId(ORGANIZATION_ID);
        User loggedUser = UserTestUtils.getUser();
        ReactivationRolesRequest request = new ReactivationRolesRequest(Set.of(Role.TRAINER));

        //when
        when(loggedUserService.getLoggedUser()).thenReturn(loggedUser);
        doNothing().when(userInvitationService).inviteDeactivatedUser(any(), any(), any(), anySet());

        //then
        ResponseEntity<Void> response = userController.reactivateUser(USER_ID, organizationId, request);
        assertEquals(ResponseEntity.ok().build(), response);
        verify(userInvitationService).inviteDeactivatedUser(loggedUser, USER_ID, ORGANIZATION_ID, request.getRoles());
    }

    @Test
    void expectUpdatesUser() {
        //given
        OrganizationId organizationId = new OrganizationId(1L);
        User userToUpdate = UserTestUtils.getUser();
        userToUpdate.setFirstName("New First Name");
        userToUpdate.setLastName("New Last Name");

        User loggedUser = UserTestUtils.getUser();
        var trainerRole = new OrganizationUserRoleShortDto();
        trainerRole.setRole(Role.TRAINER);
        loggedUser.setRoles(Set.of(trainerRole));

        //when
        when(loggedUserService.getLoggedUser()).thenReturn(loggedUser);
        when(userService.update(userToUpdate, organizationId.getId(), loggedUser)).thenReturn(userToUpdate);

        //then
        ResponseEntity<User> updatedUserResponseEntity = userController.updateOne(userToUpdate, organizationId);
        assertEquals(ResponseEntity.ok(userToUpdate), updatedUserResponseEntity);
    }

    @Test
    void expectAccessDeniedExceptionWhenAttemptToUpdateUserAndLoggedUserHasParticipantRole() {
        //given
        OrganizationId organizationId = new OrganizationId(1L);
        User userToUpdate = UserTestUtils.getUser();
        userToUpdate.setFirstName("New First Name");
        userToUpdate.setLastName("New Last Name");

        User loggedUser = UserTestUtils.getUser();
        var participantRole = new OrganizationUserRoleShortDto();
        participantRole.setRole(Role.PARTICIPANT);
        loggedUser.setRoles(Set.of(participantRole));
        Exception ex = new AccessDeniedException("User doesn't have permissions to update active status in organization.");

        //when
        when(loggedUserService.getLoggedUser()).thenReturn(loggedUser);
        when(userService.update(userToUpdate, organizationId.getId(), loggedUser))
            .thenThrow(ex);

        //then
        assertThrows(AccessDeniedException.class, () -> userController.updateOne(userToUpdate, organizationId));
    }

    @Test
    void expectChangesOrganizationAdminInProvidedOrganization() {
        //given
        Long organizationId = 1L;
        Long userToTurnAdminId = 29L;
        OrganizationUserRoleShortDto userRole = new OrganizationUserRoleShortDto();
        userRole.setUserId(userToTurnAdminId);
        userRole.setOrganizationId(organizationId);


        OrganizationUserRole expectedTrainerTurnedToAdminRole =
            buildOrganizationUserRole(organizationId, userToTurnAdminId, Role.ORGANIZATION_ADMIN);

        //when
        when(userRoleService.changeOrganizationAdmin(organizationId, userToTurnAdminId))
            .thenReturn(expectedTrainerTurnedToAdminRole);

        //then
        ResponseEntity<OrganizationUserRole> expectedResponse = ResponseEntity.ok(expectedTrainerTurnedToAdminRole);
        ResponseEntity<OrganizationUserRole> changedOrganizationAdminResponse =
            userController.changeOrganizationAdmin(userRole);
        assertEquals(expectedResponse, changedOrganizationAdminResponse);
    }

    private OrganizationUserRole buildOrganizationUserRole(Long userId, Long organizationId, Role role) {
        UserShortDto userShortDto = new UserShortDto();
        userShortDto.setUserId(userId);
        userShortDto.setFirstName("Ivan");
        userShortDto.setLastName("Ivanov");

        RoleEntity roleEntity = new RoleEntity();
        roleEntity.setRole(role);

        OrganizationUserRole organizationUserRole = new OrganizationUserRole();
        organizationUserRole.setUser(userShortDto);
        organizationUserRole.setOrganizationId(organizationId);
        organizationUserRole.setRole(roleEntity);

        return organizationUserRole;
    }
}
