package com.itechart.foxhunt.api.user.service;

import com.itechart.foxhunt.api.exception.UserNotRegisteredException;
import com.itechart.foxhunt.api.organization.OrganizationService;
import com.itechart.foxhunt.api.user.dao.OrganizationUserActiveHistoryRepository;
import com.itechart.foxhunt.api.user.dao.OrganizationUserRoleRepository;
import com.itechart.foxhunt.api.user.dao.ResetPasswordRequestRepository;
import com.itechart.foxhunt.api.user.dao.SystemAdminRepository;
import com.itechart.foxhunt.api.user.dao.UserInvitationRepository;
import com.itechart.foxhunt.api.user.dao.UserRepository;
import com.itechart.foxhunt.api.user.dto.GetUsersRequest;
import com.itechart.foxhunt.api.user.dto.OrganizationUserRoleProjection;
import com.itechart.foxhunt.api.user.dto.OrganizationUserRoleShortDto;
import com.itechart.foxhunt.api.user.dto.RegistrationUserInfo;
import com.itechart.foxhunt.api.user.dto.User;
import com.itechart.foxhunt.api.user.dto.UserProjection;
import com.itechart.foxhunt.api.user.email.EmailHandler;
import com.itechart.foxhunt.api.user.email.EmailTemplateRepository;
import com.itechart.foxhunt.api.user.email.role.ChangingRoleInfoKeeper;
import com.itechart.foxhunt.api.user.mapper.OrganizationUserRoleMapper;
import com.itechart.foxhunt.api.user.mapper.OrganizationUserRoleMapperImpl;
import com.itechart.foxhunt.api.user.mapper.UserMapper;
import com.itechart.foxhunt.api.user.mapper.UserMapperImpl;
import com.itechart.foxhunt.api.user.service.validator.UserValidator;
import com.itechart.foxhunt.api.user.util.UserTestUtils;
import com.itechart.foxhunt.domain.entity.OrganizationUserRoleEntity;
import com.itechart.foxhunt.domain.entity.OrganizationUserRoleEntityPK;
import com.itechart.foxhunt.domain.entity.RoleEntity;
import com.itechart.foxhunt.domain.entity.UserEntity;
import com.itechart.foxhunt.domain.entity.UserInvitationEntity;
import com.itechart.foxhunt.domain.enums.Role;
import com.itechart.foxhunt.domain.enums.UserInvitationStatus;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.projection.ProjectionFactory;
import org.springframework.data.projection.SpelAwareProxyProjectionFactory;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import javax.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.LongStream;
import java.util.stream.Stream;

import static com.itechart.foxhunt.api.TestDataKeeper.ORGANIZATION_ID;
import static com.itechart.foxhunt.api.TestDataKeeper.USER_ID;
import static com.itechart.foxhunt.api.TestDataKeeper.USER_EMAIL;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anySet;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith({MockitoExtension.class, SpringExtension.class})
@ContextConfiguration(classes = {
    UserMapperImpl.class, OrganizationUserRoleMapperImpl.class, UserServiceImpl.class, UserValidator.class
})
public class UserServiceTest {

    ProjectionFactory projectionFactory = new SpelAwareProxyProjectionFactory();

    @MockBean
    SystemAdminRepository systemAdminRepository;

    @MockBean
    UserRepository userRepository;

    @MockBean
    OrganizationService organizationService;

    @MockBean
    OrganizationUserRoleRepository organizationUserRoleRepository;

    @MockBean
    private OrganizationUserRoleService organizationUserRoleService;

    @MockBean
    OrganizationUserActiveHistoryRepository organizationUserActiveHistoryRepository;

    @MockBean
    private PasswordEncoder passwordEncoder;

    @MockBean
    private ResetPasswordRequestRepository resetPasswordRequestRepository;

    @MockBean
    private EmailHandler<ChangingRoleInfoKeeper> emailHandler;

    @MockBean
    private EmailTemplateRepository emailTemplateRepository;

    @MockBean
    private UserInvitationRepository userInvitationRepository;

    @Autowired
    UserMapper userMapper;

    @Autowired
    OrganizationUserRoleMapper organizationUserRoleMapper;

    @Autowired
    UserService userService;

    @Autowired
    private UserValidator userValidator;

    @Test
    public void expectReturnsAllUsersWithInProvidedOrganizationAndOneOfUsersIsInactive() {
        //given
        PageRequest pageable = PageRequest.of(0, 10);
        GetUsersRequest request = new GetUsersRequest();
        Long inactiveUserId = USER_ID;
        Role trainerRole = Role.TRAINER;
        List<User> usersWithCustomNames = buildUsersForProvidedFirstNames(List.of("James", "Robert", "John"));
        List<Long> userIds = usersWithCustomNames.stream().map(User::getId).toList();

        List<User> expectedReturnedUsers = usersWithCustomNames.stream()
            .peek(user -> {
                boolean isRoleActive = !user.getId().equals(inactiveUserId);
                Set<OrganizationUserRoleProjection> userRoleProjections =
                    Set.of(buildOrganizationUserRoleProjection(ORGANIZATION_ID, user, trainerRole, isRoleActive));

                boolean isUserActiveInOrganization =
                    userRoleProjections.stream().allMatch(OrganizationUserRoleProjection::getIsActive);
                Set<OrganizationUserRoleShortDto> userRoles = userRoleProjections
                    .stream().map(organizationUserRoleMapper::projectionToShortDto)
                    .collect(Collectors.toSet());

                user.setActivated(isUserActiveInOrganization);
                user.setRoles(userRoles);
            }).collect(Collectors.toList());

        List<UserProjection> userEntitiesToReturnFromDb = expectedReturnedUsers.stream()
            .map(this::buildUserProjection).toList();
        List<OrganizationUserRoleProjection> userRolesToReturnFromDb = expectedReturnedUsers.stream()
            .flatMap(user -> user.getRoles().stream()
                .map(role -> buildOrganizationUserRoleProjection(ORGANIZATION_ID, user, trainerRole, user.isActivated())))
            .toList();

        //when
        when(userRepository.findAllByOrganizationId(ORGANIZATION_ID, request.getRoles(), request.getIsActive(), pageable))
            .thenReturn(userEntitiesToReturnFromDb);
        when(organizationUserRoleRepository.findAllByOrganizationAndUsersAndRoles(ORGANIZATION_ID, userIds, request.getRoles()))
            .thenReturn(userRolesToReturnFromDb);

        //then
        List<User> returnedUsers = userService.getAll(ORGANIZATION_ID, request, pageable);
        assertEquals(expectedReturnedUsers, returnedUsers);

        User returnedInactiveUser = returnedUsers.stream()
            .filter(user -> user.getId().equals(inactiveUserId)).findFirst()
            .orElseThrow(() -> new AssertionError("Inactive user is not found in returned users"));
        assertFalse(returnedInactiveUser.isActivated());
    }

    @Test
    public void expectReturnsNumberOfUsersAssociatedWithProvidedOrganization() {
        //given
        long expectedNumberOfUsers = 11;

        //when
        when(userRepository.countAllByOrganizationId(ORGANIZATION_ID)).thenReturn(expectedNumberOfUsers);

        //then
        long numberOfUsers = userService.countAll(ORGANIZATION_ID);
        assertEquals(expectedNumberOfUsers, numberOfUsers);
    }

    @Test
    public void expectReturnsUserByIdAndUserActiveInOrganization() {
        //given
        User expectedReturnedUser = UserTestUtils.getActivatedUser();
        UserEntity userEntityToReturnFromDb = userMapper.domainToEntity(expectedReturnedUser);

        Set<OrganizationUserRoleEntity> userRolesFromDb = Stream.of(Role.PARTICIPANT, Role.TRAINER)
            .map(role -> buildOrganizationUserRole(ORGANIZATION_ID, userEntityToReturnFromDb, buildRoleEntity(role), true))
            .collect(Collectors.toSet());
        Set<OrganizationUserRoleShortDto> expectedUserRoles = userRolesFromDb.stream()
            .map(organizationUserRoleMapper::entityToShortDto)
            .collect(Collectors.toSet());

        expectedReturnedUser.setRoles(expectedUserRoles);

        //when
        when(userRepository.findByIdAndOrganizationId(USER_ID, ORGANIZATION_ID))
            .thenReturn(Optional.of(userEntityToReturnFromDb));
        when(organizationUserRoleService.findAllByOrganizationIdAndUserId(ORGANIZATION_ID, USER_ID))
            .thenReturn(userRolesFromDb);

        //then
        User returnedUser = userService.findById(USER_ID, ORGANIZATION_ID);
        assertEquals(expectedReturnedUser, returnedUser);
        assertTrue(expectedReturnedUser.isActivated());
    }

    @Test
    public void expectReturnsUserByIdAndUserInactiveInOrganization() {
        //given
        User expectedReturnedUser = UserTestUtils.getUser();
        UserEntity userEntityToReturnFromDb = userMapper.domainToEntity(expectedReturnedUser);

        Set<OrganizationUserRoleEntity> userRolesFromDb = Stream.of(Role.TRAINER, Role.PARTICIPANT)
            .map(role -> buildOrganizationUserRole(ORGANIZATION_ID, userEntityToReturnFromDb, buildRoleEntity(role), false))
            .collect(Collectors.toSet());
        Set<OrganizationUserRoleShortDto> expectedUserRoles = userRolesFromDb.stream()
            .map(organizationUserRoleMapper::entityToShortDto)
            .collect(Collectors.toSet());

        expectedReturnedUser.setRoles(expectedUserRoles);
        expectedReturnedUser.setActivated(false);

        //when
        when(userRepository.findByIdAndOrganizationId(USER_ID, ORGANIZATION_ID))
            .thenReturn(Optional.of(userEntityToReturnFromDb));
        when(organizationUserRoleService.findAllByOrganizationIdAndUserId(ORGANIZATION_ID, USER_ID))
            .thenReturn(userRolesFromDb);

        //then
        User returnedUser = userService.findById(USER_ID, ORGANIZATION_ID);
        assertEquals(expectedReturnedUser, returnedUser);
        assertFalse(expectedReturnedUser.isActivated());
    }

    @Test
    public void expectEntityNotFoundExceptionWhenUserNotAssociatedWithProvidedOrganization() {
        //when
        when(userRepository.findByIdAndOrganizationId(USER_ID, ORGANIZATION_ID)).thenReturn(Optional.empty());

        //then
        assertThrows(EntityNotFoundException.class, () -> userService.findById(USER_ID, ORGANIZATION_ID));
    }

    @Test
    public void expectReturnsUserByIdWhenUserAssociatedWithProvidedId() {
        //given
        UserEntity expectedReturnedUser = userMapper.domainToEntity(UserTestUtils.getUser());

        //when
        when(userRepository.getById(USER_ID)).thenReturn(expectedReturnedUser);

        //then
        UserEntity returnedUser = userService.getOne(USER_ID);
        assertEquals(expectedReturnedUser, returnedUser);
    }

    @Test
    public void expectReturnsNullWhenUserAssociatedWithProvidedIdNotFound() {
        //when
        when(userRepository.getById(USER_ID)).thenReturn(null);

        //then
        UserEntity returnedUser = userService.getOne(USER_ID);
        assertNull(returnedUser);
    }

    @Test
    public void expectCreatesUser() {
        //given
        User expectedCreatedUser = UserTestUtils.getUser();
        UserEntity userToCreate = userMapper.domainToEntity(expectedCreatedUser);

        //when
        when(userRepository.save(userToCreate)).thenReturn(userToCreate);

        //then
        User createdUser = userService.create(expectedCreatedUser);
        assertEquals(expectedCreatedUser, createdUser);
    }

    @Test
    public void expectReturnsUserByEmail() {
        //given
        User expectedReturnedUser = UserTestUtils.getUser();
        UserEntity userToReturnFromDb = userMapper.domainToEntity(expectedReturnedUser);
        String userEmail = expectedReturnedUser.getEmail();

        //when
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(userToReturnFromDb));

        //then
        User returnedUser = userService.findByEmail(userEmail);
        assertEquals(expectedReturnedUser, returnedUser);
    }

    @Test
    public void expectEntityNotFoundExceptionWhenUserAssociatedWithEmailNotFound() {
        //given
        String userEmail = "not.associated.with.user@gmail.com";

        //when
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.empty());

        //then
        assertThrows(EntityNotFoundException.class, () -> userService.findByEmail(userEmail));
    }

    @Test
    public void expectSetUserRegistrationInformation() {
        //given
        LocalDateTime activatedSince = LocalDateTime.now();

        RegistrationUserInfo registrationUserInfo = UserTestUtils.getRegistrationUserInfo();
        String userEmail = registrationUserInfo.getEmail();
        UserEntity userToReturnFromDb = userMapper.domainToEntity(UserTestUtils.getUser());
        List<Role> userRoles = List.of(Role.TRAINER, Role.ORGANIZATION_ADMIN);

        List<OrganizationUserRoleEntity> userRolesToReturnFromDb =
            createOrganizationUserRoles(ORGANIZATION_ID, userToReturnFromDb, userRoles);
        Set<OrganizationUserRoleShortDto> expectedUserRoles = userRolesToReturnFromDb.stream()
            .map(organizationUserRoleMapper::entityToShortDto)
            .collect(Collectors.toSet());

        //when
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(userToReturnFromDb));

        UserEntity savedUser = userMapper.domainToEntity(UserTestUtils.getUser());
        UserEntity userEntityWithRegistrationInfo = userMapper.mergeDomainToEntity(savedUser, registrationUserInfo);
        userEntityWithRegistrationInfo.setActivated(true);
        userEntityWithRegistrationInfo.setActivatedSince(activatedSince);
        when(userRepository.save(any())).thenReturn(userEntityWithRegistrationInfo);

        when(organizationUserRoleRepository.findAllByUserId(any())).thenReturn(userRolesToReturnFromDb);

        //then
        User expectedReturnedUser = userMapper.entityToDomain(userEntityWithRegistrationInfo);
        expectedReturnedUser.setRoles(expectedUserRoles);

        User returnedUser = userService.setRegistrationUserInfo(registrationUserInfo);
        returnedUser.setActivatedSince(activatedSince);
        assertEquals(expectedReturnedUser, returnedUser);
    }

    @Test
    public void expectSetUserPassword() {
        //given
        String newPassword = "TmV3X0VuY29kZWRfUGFzc3dvcmQ=";
        User expectedUserWithUpdatedPassword = UserTestUtils.getUser();
        expectedUserWithUpdatedPassword.setPassword(newPassword);
        UserEntity userToReturnFromDb = userMapper.domainToEntity(UserTestUtils.getUser());

        //when
        when(userRepository.findByEmail(expectedUserWithUpdatedPassword.getEmail())).thenReturn(Optional.of(userToReturnFromDb));
        when(userRepository.save(userToReturnFromDb)).thenReturn(userToReturnFromDb);

        //then
        User userWithUpdatedPassword = userService.setPassword(expectedUserWithUpdatedPassword);
        assertEquals(expectedUserWithUpdatedPassword, userWithUpdatedPassword);
    }

    @Test
    public void expectEntityNotFoundExceptionWhenSetPasswordToUserNotAssociatedWithProvidedEmail() {
        //given
        String newPassword = "TmV3X0VuY29kZWRfUGFzc3dvcmQ=";
        User userToPasswordUpdate = UserTestUtils.getUser();
        userToPasswordUpdate.setPassword(newPassword);

        //when
        when(userRepository.findByEmail(userToPasswordUpdate.getEmail())).thenReturn(Optional.empty());

        //then
        assertThrows(EntityNotFoundException.class, () -> userService.setPassword(userToPasswordUpdate));
    }

    @Test
    public void shouldDeactivateUserSuccessfully() {
        User loggedUser = UserTestUtils.getUser();
        OrganizationUserRoleShortDto loggedUserRole =
            new OrganizationUserRoleShortDto(ORGANIZATION_ID, loggedUser.getId(), Role.ORGANIZATION_ADMIN, Boolean.TRUE);
        loggedUser.setRoles(Set.of(loggedUserRole));

        UserEntity updatedUserEntity = UserTestUtils.getUserEntity();
        Long updatedUserId = USER_ID + USER_ID;
        updatedUserEntity.setId(updatedUserId);
        RoleEntity updatedUserRole = new RoleEntity();
        updatedUserRole.setRole(Role.PARTICIPANT);
        updatedUserEntity.setRoles(Set.of(updatedUserRole));

        when(userRepository.findByIdAndOrganizationId(anyLong(), anyLong())).thenReturn(Optional.of(updatedUserEntity));
        doNothing().when(organizationUserRoleService).deactivateAllRoles(anyLong(), anyLong());
        when(organizationUserActiveHistoryRepository.save(any())).thenReturn(null);

        userService.deactivate(loggedUser, updatedUserId, ORGANIZATION_ID);

        verify(userRepository).findByIdAndOrganizationId(updatedUserId, ORGANIZATION_ID);
        verify(organizationUserRoleService).deactivateAllRoles(ORGANIZATION_ID, updatedUserId);
        verify(organizationUserActiveHistoryRepository).save(any());
    }

    @Test
    public void shouldThrowUserNotRegisteredExceptionWhenUserTriesDeactivateNotRegisteredUser() {
        User loggedUser = UserTestUtils.getUser();
        UserEntity updatedUserEntity = UserTestUtils.getUserEntity();
        updatedUserEntity.setActivatedSince(null);

        when(userRepository.findByIdAndOrganizationId(anyLong(), anyLong())).thenReturn(Optional.of(updatedUserEntity));

        assertThrows(UserNotRegisteredException.class,
            () -> userService.deactivate(loggedUser, updatedUserEntity.getId(), ORGANIZATION_ID));
    }

    @Test
    public void shouldThrowAccessDeniedExceptionWhenUserTriesDeactivateHimself() {
        User loggedUser = UserTestUtils.getUser();
        UserEntity updatedUserEntity = UserTestUtils.getUserEntity();

        when(userRepository.findByIdAndOrganizationId(anyLong(), anyLong())).thenReturn(Optional.of(updatedUserEntity));

        assertThrows(AccessDeniedException.class,
            () -> userService.deactivate(loggedUser, updatedUserEntity.getId(), ORGANIZATION_ID));
    }

    @Test
    public void shouldThrowAccessDeniedExceptionWhenUserDoesNotHavePermission() {
        User loggedUser = UserTestUtils.getUser();
        OrganizationUserRoleShortDto loggedUserRole =
            new OrganizationUserRoleShortDto(ORGANIZATION_ID, loggedUser.getId(), Role.PARTICIPANT, Boolean.TRUE);
        loggedUser.setRoles(Set.of(loggedUserRole));

        UserEntity updatedUserEntity = UserTestUtils.getUserEntity();
        RoleEntity updatedUserRole = new RoleEntity();
        updatedUserRole.setRole(Role.TRAINER);
        updatedUserEntity.setRoles(Set.of(updatedUserRole));

        when(userRepository.findByIdAndOrganizationId(anyLong(), anyLong())).thenReturn(Optional.of(updatedUserEntity));

        assertThrows(AccessDeniedException.class,
            () -> userService.deactivate(loggedUser, updatedUserEntity.getId(), ORGANIZATION_ID));
    }

    @Test
    public void expectUpdatesUserWhenOrganizationAdminUpdatesTrainerOrParticipant() {
        //given
        User loggedUser = UserTestUtils.getActivatedUser();
        OrganizationUserRoleShortDto organizationAdminRole = new OrganizationUserRoleShortDto();
        organizationAdminRole.setRole(Role.ORGANIZATION_ADMIN);
        loggedUser.setRoles(Set.of(organizationAdminRole));
        loggedUser.setId(USER_ID);

        Long trainerId = USER_ID + USER_ID;
        User updateTrainerRequest = UserTestUtils.getActivatedUser();
        updateTrainerRequest.setId(trainerId);
        updateTrainerRequest.setFirstName("Updated Trainer Name");
        OrganizationUserRoleShortDto organizationTrainerRole = new OrganizationUserRoleShortDto();
        organizationTrainerRole.setRole(Role.TRAINER);
        updateTrainerRequest.setRoles(Set.of(organizationTrainerRole));

        UserEntity trainerToUpdate = userMapper.domainToEntity(UserTestUtils.getActivatedUser());
        trainerToUpdate.setId(trainerId);
        OrganizationUserRoleEntity trainerUserRole = buildOrganizationUserRole(
            ORGANIZATION_ID, trainerToUpdate, buildRoleEntity(Role.TRAINER), true);
        trainerToUpdate.setRoles(Set.of(trainerUserRole.getRoleEntity()));

        Long participantId = USER_ID + USER_ID + USER_ID;
        User updateParticipantRequest = UserTestUtils.getActivatedUser();
        updateParticipantRequest.setId(participantId);
        updateParticipantRequest.setFirstName("Updated Participant Name");
        OrganizationUserRoleShortDto organizationParticipantRole = new OrganizationUserRoleShortDto();
        organizationParticipantRole.setRole(Role.PARTICIPANT);
        updateParticipantRequest.setRoles(Set.of(organizationParticipantRole));

        UserEntity participantToUpdate = userMapper.domainToEntity(UserTestUtils.getActivatedUser());
        participantToUpdate.setId(participantId);
        OrganizationUserRoleEntity participantUserRole = buildOrganizationUserRole(
            ORGANIZATION_ID, participantToUpdate, buildRoleEntity(Role.PARTICIPANT), true);
        participantToUpdate.setRoles(Set.of(participantUserRole.getRoleEntity()));

        //when
        when(userRepository.findByIdAndOrganizationId(anyLong(), anyLong())).thenReturn(Optional.of(trainerToUpdate));

        when(organizationUserRoleService.findAllByOrganizationIdAndUserId(anyLong(), anyLong()))
            .thenReturn(Set.of(trainerUserRole));
        when(userRepository.save(trainerToUpdate)).thenReturn(trainerToUpdate);

        when(userRepository.findByIdAndOrganizationId(anyLong(), anyLong())).thenReturn(Optional.of(participantToUpdate));
        when(organizationUserRoleService.findAllByOrganizationIdAndUserId(anyLong(), anyLong()))
            .thenReturn(Set.of(participantUserRole));
        when(userRepository.save(participantToUpdate)).thenReturn(participantToUpdate);

        //then
        User updatedTrainer = userService.update(updateTrainerRequest, ORGANIZATION_ID, loggedUser);
        User updatedParticipant = userService.update(updateParticipantRequest, ORGANIZATION_ID, loggedUser);
        assertEquals(updateTrainerRequest.getFirstName(), updatedTrainer.getFirstName());
        assertEquals(updateParticipantRequest.getFirstName(), updatedParticipant.getFirstName());
    }

    @Test
    public void expectAddingRolesWhenOrganizationAdminUpdatesTrainerOrParticipant() {
        //given
        User loggedUser = UserTestUtils.getActivatedUser();
        OrganizationUserRoleShortDto organizationAdminRole = new OrganizationUserRoleShortDto();
        organizationAdminRole.setRole(Role.ORGANIZATION_ADMIN);
        loggedUser.setRoles(Set.of(organizationAdminRole));
        loggedUser.setId(USER_ID);

        OrganizationUserRoleShortDto organizationParticipantRole = new OrganizationUserRoleShortDto();
        organizationParticipantRole.setRole(Role.PARTICIPANT);
        OrganizationUserRoleShortDto organizationTrainerRole = new OrganizationUserRoleShortDto();
        organizationTrainerRole.setRole(Role.TRAINER);

        Long trainerId = USER_ID + USER_ID;
        User updateTrainerRequest = UserTestUtils.getActivatedUser();
        updateTrainerRequest.setId(trainerId);
        updateTrainerRequest.setRoles(Set.of(organizationParticipantRole, organizationTrainerRole));

        UserEntity trainerToUpdate = userMapper.domainToEntity(UserTestUtils.getActivatedUser());
        trainerToUpdate.setId(trainerId);
        OrganizationUserRoleEntity trainerUserRole = buildOrganizationUserRole(
            ORGANIZATION_ID, trainerToUpdate, buildRoleEntity(Role.TRAINER), true);
        trainerToUpdate.setRoles(Set.of(trainerUserRole.getRoleEntity()));

        Long participantId = USER_ID + USER_ID + USER_ID;
        User updateParticipantRequest = UserTestUtils.getActivatedUser();
        updateParticipantRequest.setId(participantId);
        updateParticipantRequest.setRoles(Set.of(organizationTrainerRole, organizationParticipantRole));

        UserEntity participantToUpdate = userMapper.domainToEntity(UserTestUtils.getActivatedUser());
        participantToUpdate.setId(participantId);
        OrganizationUserRoleEntity participantUserRole = buildOrganizationUserRole(
            ORGANIZATION_ID, participantToUpdate, buildRoleEntity(Role.PARTICIPANT), true);
        participantToUpdate.setRoles(Set.of(participantUserRole.getRoleEntity()));

        //when
        when(userRepository.findByIdAndOrganizationId(anyLong(), anyLong())).thenReturn(Optional.of(trainerToUpdate));

        when(organizationUserRoleService.findAllByOrganizationIdAndUserId(anyLong(), anyLong()))
            .thenReturn(Set.of(trainerUserRole));
        when(userRepository.save(trainerToUpdate)).thenReturn(trainerToUpdate);

        when(userRepository.findByIdAndOrganizationId(anyLong(), anyLong())).thenReturn(Optional.of(participantToUpdate));
        when(organizationUserRoleService.findAllByOrganizationIdAndUserId(anyLong(), anyLong()))
            .thenReturn(Set.of(participantUserRole));
        when(userRepository.save(participantToUpdate)).thenReturn(participantToUpdate);

        //then
        userService.update(updateTrainerRequest, ORGANIZATION_ID, loggedUser);
        userService.update(updateParticipantRequest, ORGANIZATION_ID, loggedUser);
        verify(organizationUserRoleService).deleteAllRoles(ORGANIZATION_ID, trainerId);
        verify(organizationUserRoleService, times(2)).addUsersToOrganization(eq(ORGANIZATION_ID), any(), eq(Set.of(Role.PARTICIPANT, Role.TRAINER)));
        verify(organizationUserRoleService).updateActiveStatus(ORGANIZATION_ID, trainerId, true);
        verify(organizationUserRoleService).deleteAllRoles(ORGANIZATION_ID, participantId);
        verify(organizationUserRoleService).updateActiveStatus(ORGANIZATION_ID, participantId, true);
    }

    @Test
    public void expectDeletingRolesWhenOrganizationAdminUpdatesTrainerAndParticipant() {
        //given
        User loggedUser = UserTestUtils.getActivatedUser();
        OrganizationUserRoleShortDto organizationAdminRole = new OrganizationUserRoleShortDto();
        organizationAdminRole.setRole(Role.ORGANIZATION_ADMIN);
        loggedUser.setRoles(Set.of(organizationAdminRole));
        loggedUser.setId(USER_ID);

        OrganizationUserRoleShortDto organizationParticipantRole = new OrganizationUserRoleShortDto();
        organizationParticipantRole.setRole(Role.PARTICIPANT);
        OrganizationUserRoleShortDto organizationTrainerRole = new OrganizationUserRoleShortDto();
        organizationTrainerRole.setRole(Role.TRAINER);

        Long user1Id = USER_ID + USER_ID;
        User updateUser1Request = UserTestUtils.getActivatedUser();
        updateUser1Request.setId(user1Id);
        updateUser1Request.setRoles(Set.of(organizationTrainerRole));

        UserEntity user1ToUpdate = userMapper.domainToEntity(UserTestUtils.getActivatedUser());
        user1ToUpdate.setId(user1Id);
        OrganizationUserRoleEntity trainerUser1Role = buildOrganizationUserRole(
            ORGANIZATION_ID, user1ToUpdate, buildRoleEntity(Role.TRAINER), true);
        OrganizationUserRoleEntity participantUser1Role = buildOrganizationUserRole(
            ORGANIZATION_ID, user1ToUpdate, buildRoleEntity(Role.PARTICIPANT), true);
        user1ToUpdate.setRoles(Set.of(trainerUser1Role.getRoleEntity(), participantUser1Role.getRoleEntity()));

        Long user2Id = USER_ID + USER_ID + USER_ID;
        User updateParticipantRequest = UserTestUtils.getActivatedUser();
        updateParticipantRequest.setId(user2Id);
        updateParticipantRequest.setRoles(Set.of(organizationParticipantRole));

        UserEntity user2ToUpdate = userMapper.domainToEntity(UserTestUtils.getActivatedUser());
        user2ToUpdate.setId(user2Id);
        OrganizationUserRoleEntity participantUser2Role = buildOrganizationUserRole(
            ORGANIZATION_ID, user2ToUpdate, buildRoleEntity(Role.PARTICIPANT), true);
        OrganizationUserRoleEntity trainerUser2Role = buildOrganizationUserRole(
            ORGANIZATION_ID, user2ToUpdate, buildRoleEntity(Role.TRAINER), true);
        user2ToUpdate.setRoles(Set.of(participantUser2Role.getRoleEntity(), trainerUser2Role.getRoleEntity()));

        //when
        when(userRepository.findByIdAndOrganizationId(anyLong(), anyLong())).thenReturn(Optional.of(user1ToUpdate));
        when(organizationUserRoleService.findAllByOrganizationIdAndUserId(anyLong(), anyLong()))
            .thenReturn(Set.of(trainerUser1Role, participantUser1Role));
        when(userRepository.save(user1ToUpdate)).thenReturn(user1ToUpdate);

        when(userRepository.findByIdAndOrganizationId(anyLong(), anyLong())).thenReturn(Optional.of(user2ToUpdate));
        when(organizationUserRoleService.findAllByOrganizationIdAndUserId(anyLong(), anyLong()))
            .thenReturn(Set.of(participantUser2Role, trainerUser2Role));
        when(userRepository.save(user2ToUpdate)).thenReturn(user2ToUpdate);

        //then
        userService.update(updateUser1Request, ORGANIZATION_ID, loggedUser);
        verify(organizationUserRoleService).deleteAllRoles(ORGANIZATION_ID, user1Id);
        verify(organizationUserRoleService).addUsersToOrganization(eq(ORGANIZATION_ID), any(), eq(Set.of(Role.TRAINER)));
        verify(organizationUserRoleService).updateActiveStatus(ORGANIZATION_ID, user1Id, true);
        userService.update(updateParticipantRequest, ORGANIZATION_ID, loggedUser);
        verify(organizationUserRoleService).deleteAllRoles(ORGANIZATION_ID, user2Id);
        verify(organizationUserRoleService).addUsersToOrganization(eq(ORGANIZATION_ID), any(), eq(Set.of( Role.PARTICIPANT)));
        verify(organizationUserRoleService).updateActiveStatus(ORGANIZATION_ID, user2Id, true);
    }

    @Test
    public void expectUpdatesUserWhenUserUpdatesHimself() {

        User loggedUser = UserTestUtils.getActivatedUser();
        OrganizationUserRoleShortDto organizationAdminRole = new OrganizationUserRoleShortDto();
        organizationAdminRole.setRole(Role.ORGANIZATION_ADMIN);
        loggedUser.setRoles(Set.of(organizationAdminRole));
        loggedUser.setId(USER_ID);

        User updateUserRequest = UserTestUtils.getActivatedUser();
        updateUserRequest.setId(USER_ID);
        updateUserRequest.setFirstName("Updated First Name");
        updateUserRequest.setRoles(Set.of(organizationAdminRole));

        UserEntity userToUpdate = userMapper.domainToEntity(UserTestUtils.getActivatedUser());
        userToUpdate.setId(USER_ID);
        OrganizationUserRoleEntity organizationAdminUserRole = buildOrganizationUserRole(
            ORGANIZATION_ID, userToUpdate, buildRoleEntity(Role.ORGANIZATION_ADMIN), true);

        //when
        when(userRepository.findByIdAndOrganizationId(anyLong(), anyLong())).thenReturn(Optional.of(userToUpdate));
        when(organizationUserRoleService.findAllByOrganizationIdAndUserId(anyLong(), anyLong()))
            .thenReturn(Set.of(organizationAdminUserRole));
        when(userRepository.save(userToUpdate)).thenReturn(userToUpdate);

        //then
        User updatedUser = userService.update(updateUserRequest, ORGANIZATION_ID, loggedUser);
        assertEquals(updateUserRequest.getFirstName(), updatedUser.getFirstName());
    }

    @Test
    public void expectUpdatesUserWhenTrainerUpdatesParticipant() {
        User loggedUser = UserTestUtils.getActivatedUser();
        OrganizationUserRoleShortDto trainerRole = new OrganizationUserRoleShortDto();
        trainerRole.setRole(Role.TRAINER);
        loggedUser.setRoles(Set.of(trainerRole));
        loggedUser.setId(USER_ID);

        Long participantId = USER_ID + USER_ID;
        User updateParticipantRequest = UserTestUtils.getActivatedUser();
        updateParticipantRequest.setId(participantId);
        updateParticipantRequest.setFirstName("Updated Participant Name");
        OrganizationUserRoleShortDto participantRole = new OrganizationUserRoleShortDto();
        participantRole.setRole(Role.PARTICIPANT);
        updateParticipantRequest.setRoles(Set.of(participantRole));

        UserEntity participantToUpdate = userMapper.domainToEntity(UserTestUtils.getActivatedUser());
        participantToUpdate.setId(participantId);
        OrganizationUserRoleEntity participantUserRole = buildOrganizationUserRole(
            ORGANIZATION_ID, participantToUpdate, buildRoleEntity(Role.PARTICIPANT), true);

        //when
        when(userRepository.findByIdAndOrganizationId(anyLong(), anyLong())).thenReturn(Optional.of(participantToUpdate));
        when(organizationUserRoleService.findAllByOrganizationIdAndUserId(anyLong(), anyLong()))
            .thenReturn(Set.of(participantUserRole));
        when(userRepository.save(participantToUpdate)).thenReturn(participantToUpdate);

        //then
        User updatedParticipant = userService.update(updateParticipantRequest, ORGANIZATION_ID, loggedUser);
        assertEquals(updateParticipantRequest.getFirstName(), updatedParticipant.getFirstName());
    }

    @Test
    public void expectAccessDeniedExceptionWhenTrainerUpdatesOrganizationAdminOrOtherTrainer() {
        User loggedUser = UserTestUtils.getActivatedUser();
        OrganizationUserRoleShortDto trainerRole = new OrganizationUserRoleShortDto();
        trainerRole.setRole(Role.TRAINER);
        loggedUser.setRoles(Set.of(trainerRole));
        loggedUser.setId(USER_ID);

        Long adminId = USER_ID + USER_ID;
        User updateOrgAdminRequest = UserTestUtils.getActivatedUser();
        updateOrgAdminRequest.setId(adminId);
        updateOrgAdminRequest.setFirstName("Updated Org Admin Name");
        OrganizationUserRoleShortDto orgAdminRole = new OrganizationUserRoleShortDto();
        orgAdminRole.setRole(Role.ORGANIZATION_ADMIN);
        updateOrgAdminRequest.setRoles(Set.of(orgAdminRole));

        UserEntity orgAdminToUpdate = userMapper.domainToEntity(UserTestUtils.getActivatedUser());
        orgAdminToUpdate.setId(adminId);
        OrganizationUserRoleEntity organizationAdminUserRole =
            buildOrganizationUserRole(ORGANIZATION_ID, orgAdminToUpdate, buildRoleEntity(Role.ORGANIZATION_ADMIN), true);

        Long otherTrainerId = USER_ID + USER_ID + USER_ID;
        User updateOtherTrainerRequest = UserTestUtils.getActivatedUser();
        updateOtherTrainerRequest.setId(otherTrainerId);
        updateOtherTrainerRequest.setFirstName("Updated Other Trainer Name");
        updateOtherTrainerRequest.setRoles(Set.of(trainerRole));

        UserEntity otherTrainerToUpdate = userMapper.domainToEntity(UserTestUtils.getActivatedUser());
        otherTrainerToUpdate.setId(otherTrainerId);
        OrganizationUserRoleEntity otherTrainerUserRole = buildOrganizationUserRole(
            ORGANIZATION_ID, otherTrainerToUpdate, buildRoleEntity(Role.TRAINER), true);

        //when
        when(userRepository.findByIdAndOrganizationId(anyLong(), anyLong())).thenReturn(Optional.of(orgAdminToUpdate));
        when(organizationUserRoleService.findAllByOrganizationIdAndUserId(anyLong(), anyLong()))
            .thenReturn(Set.of(organizationAdminUserRole));

        when(userRepository.findByIdAndOrganizationId(anyLong(), anyLong())).thenReturn(Optional.of(otherTrainerToUpdate));
        when(organizationUserRoleService.findAllByOrganizationIdAndUserId(anyLong(), anyLong()))
            .thenReturn(Set.of(otherTrainerUserRole));

        //then
        assertThrows(AccessDeniedException.class, () -> userService.update(updateOrgAdminRequest, ORGANIZATION_ID, loggedUser));
        assertThrows(AccessDeniedException.class, () -> userService.update(updateOtherTrainerRequest, ORGANIZATION_ID, loggedUser));
    }

    @Test
    public void expectEntityNotFoundExceptionWhenUnableToFindUserToUpdate() {
        //given
        User loggedUser = UserTestUtils.getActivatedUser();
        OrganizationUserRoleShortDto organizationAdminRole = new OrganizationUserRoleShortDto();
        organizationAdminRole.setRole(Role.ORGANIZATION_ADMIN);
        loggedUser.setRoles(Set.of(organizationAdminRole));
        loggedUser.setId(USER_ID);

        Long userToUpdateId = USER_ID + USER_ID;
        User updateUserRequest = UserTestUtils.getActivatedUser();
        updateUserRequest.setId(userToUpdateId);
        updateUserRequest.setFirstName("Updated First Name");

        //when
        when(userRepository.findByIdAndOrganizationId(anyLong(), anyLong())).thenReturn(Optional.empty());

        //then
        assertThrows(EntityNotFoundException.class, () -> userService.update(updateUserRequest, ORGANIZATION_ID, loggedUser));
    }

    private List<User> buildUsersForProvidedFirstNames(List<String> firstNames) {
        return IntStream.range(1, firstNames.size())
            .mapToObj(id -> {
                String name = firstNames.get(id);
                User userToTest = UserTestUtils.getUser();
                userToTest.setId((long) id);
                userToTest.setFirstName(name);
                return userToTest;
            }).collect(Collectors.toList());
    }

    @Test
    public void shouldThrowEntityNotFoundExceptionWhenActiveUserWasNotFound() {
        when(userRepository.findActiveByEmailAndOrganizationId(USER_EMAIL, ORGANIZATION_ID))
            .thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class,
            () -> userService.findActiveUserInOrganization(USER_EMAIL, ORGANIZATION_ID));
    }

    @Test
    public void shouldKeepSortedRolesByPriorityWhenUserHasSeveralRoles() {
        UserEntity userEntity = userMapper.domainToEntity(UserTestUtils.getUser());
        List<OrganizationUserRoleEntity> organizationUserRoleList = List.of(
            buildOrganizationUserRole(ORGANIZATION_ID, userEntity, buildRoleEntity(Role.PARTICIPANT), true),
            buildOrganizationUserRole(ORGANIZATION_ID, userEntity, buildRoleEntity(Role.ORGANIZATION_ADMIN), true),
            buildOrganizationUserRole(ORGANIZATION_ID, userEntity, buildRoleEntity(Role.SYSTEM_ADMIN), true),
            buildOrganizationUserRole(ORGANIZATION_ID, userEntity, buildRoleEntity(Role.TRAINER), true)
        );
        when(userRepository.findActiveByEmailAndOrganizationId(anyString(), anyLong()))
            .thenReturn(Optional.of(userEntity));
        when(organizationUserRoleRepository.findAllByUserId(anyLong())).thenReturn(organizationUserRoleList);

        User user = userService.findActiveUserInOrganization(USER_EMAIL, ORGANIZATION_ID);

        verify(userRepository).findActiveByEmailAndOrganizationId(eq(USER_EMAIL), eq(ORGANIZATION_ID));
        verify(organizationUserRoleRepository).findAllByUserId(eq(userEntity.getId()));
        assertEquals(4, user.getRoles().size());

        Map<Role, Integer> orderByRoles = new HashMap<>();
        user.getRoles().forEach(role -> orderByRoles.put(role.getRole(), orderByRoles.size()));
        List.of(Role.values()).forEach(role -> assertEquals(role.ordinal(), orderByRoles.get(role)));
    }

    @Test
    public void shouldSetIsManageMultipleOrganizationsToFalseWhenUserHasOnlyOneOrganization() {
        UserEntity userEntity = userMapper.domainToEntity(UserTestUtils.getUser());
        OrganizationUserRoleEntity organizationUserRole =
            buildOrganizationUserRole(ORGANIZATION_ID, userEntity, buildRoleEntity(Role.TRAINER), true);
        when(userRepository.findActiveByEmailAndOrganizationId(anyString(), anyLong()))
            .thenReturn(Optional.of(userEntity));
        when(organizationUserRoleRepository.findAllByUserId(anyLong())).thenReturn(List.of(organizationUserRole));

        User user = userService.findActiveUserInOrganization(USER_EMAIL, ORGANIZATION_ID);

        verify(userRepository).findActiveByEmailAndOrganizationId(eq(USER_EMAIL), eq(ORGANIZATION_ID));
        verify(organizationUserRoleRepository).findAllByUserId(eq(userEntity.getId()));
        assertFalse(user.isManageMultipleOrganizations());
    }

    @Test
    public void shouldSetIsManageMultipleOrganizationsToFalseWhenUserHasParticipantRoleInSecondOrganization() {
        UserEntity userEntity = userMapper.domainToEntity(UserTestUtils.getUser());
        List<OrganizationUserRoleEntity> organizationUserRoleList = List.of(
            buildOrganizationUserRole(ORGANIZATION_ID, userEntity, buildRoleEntity(Role.TRAINER), true),
            buildOrganizationUserRole(ORGANIZATION_ID + 1, userEntity, buildRoleEntity(Role.PARTICIPANT), true)
        );
        when(userRepository.findActiveByEmailAndOrganizationId(anyString(), anyLong()))
            .thenReturn(Optional.of(userEntity));
        when(organizationUserRoleRepository.findAllByUserId(anyLong())).thenReturn(organizationUserRoleList);

        User user = userService.findActiveUserInOrganization(USER_EMAIL, ORGANIZATION_ID);

        verify(userRepository).findActiveByEmailAndOrganizationId(eq(USER_EMAIL), eq(ORGANIZATION_ID));
        verify(organizationUserRoleRepository).findAllByUserId(eq(userEntity.getId()));
        assertFalse(user.isManageMultipleOrganizations());
    }

    @Test
    public void shouldSetIsManageMultipleOrganizationsToFalseWhenUserHasInactiveTrainerRoleInSecondOrganization() {
        UserEntity userEntity = userMapper.domainToEntity(UserTestUtils.getUser());
        List<OrganizationUserRoleEntity> organizationUserRoleList = List.of(
            buildOrganizationUserRole(ORGANIZATION_ID, userEntity, buildRoleEntity(Role.TRAINER), true),
            buildOrganizationUserRole(ORGANIZATION_ID + 1, userEntity, buildRoleEntity(Role.TRAINER), false)
        );
        when(userRepository.findActiveByEmailAndOrganizationId(anyString(), anyLong()))
            .thenReturn(Optional.of(userEntity));
        when(organizationUserRoleRepository.findAllByUserId(anyLong())).thenReturn(organizationUserRoleList);

        User user = userService.findActiveUserInOrganization(USER_EMAIL, ORGANIZATION_ID);

        verify(userRepository).findActiveByEmailAndOrganizationId(eq(USER_EMAIL), eq(ORGANIZATION_ID));
        verify(organizationUserRoleRepository).findAllByUserId(eq(userEntity.getId()));
        assertFalse(user.isManageMultipleOrganizations());
    }

    @Test
    public void shouldSetIsManageMultipleOrganizationsToTrueWhenUserHasTrainerRoleInSecondOrganization() {
        UserEntity userEntity = userMapper.domainToEntity(UserTestUtils.getUser());
        List<OrganizationUserRoleEntity> organizationUserRoleList = List.of(
            buildOrganizationUserRole(ORGANIZATION_ID, userEntity, buildRoleEntity(Role.TRAINER), true),
            buildOrganizationUserRole(ORGANIZATION_ID + 1, userEntity, buildRoleEntity(Role.TRAINER), true)
        );
        when(userRepository.findActiveByEmailAndOrganizationId(anyString(), anyLong()))
            .thenReturn(Optional.of(userEntity));
        when(organizationUserRoleRepository.findAllByUserId(anyLong())).thenReturn(organizationUserRoleList);

        User user = userService.findActiveUserInOrganization(USER_EMAIL, ORGANIZATION_ID);

        verify(userRepository).findActiveByEmailAndOrganizationId(eq(USER_EMAIL), eq(ORGANIZATION_ID));
        verify(organizationUserRoleRepository).findAllByUserId(eq(userEntity.getId()));
        assertTrue(user.isManageMultipleOrganizations());
    }

    @Test
    public void shouldBanUserSuccessfully() {
        UserEntity user = UserTestUtils.getUserEntity();
        UserInvitationEntity invitation = UserTestUtils.buildUserInvitationEntity(ORGANIZATION_ID, user);

        when(userRepository.findById(anyLong())).thenReturn(Optional.of(user));
        when(userRepository.save(any(UserEntity.class))).thenReturn(user);
        doNothing().when(organizationUserRoleService).deleteAllRoles(anyLong());
        when(userInvitationRepository.findByUserEntityAndStatus(any(UserEntity.class), any(UserInvitationStatus.class)))
            .thenReturn(Set.of(invitation));
        when(userInvitationRepository.saveAll(anySet())).thenReturn(List.of(invitation));

        userService.manageBanStatus(USER_ID);

        verify(userRepository).findById(eq(USER_ID));

        ArgumentCaptor<UserEntity> userCaptor = ArgumentCaptor.forClass(UserEntity.class);
        verify(userRepository).save(userCaptor.capture());
        UserEntity capturedUser = userCaptor.getValue();
        assertTrue(capturedUser.isBanned());
        assertFalse(capturedUser.isActivated());

        verify(organizationUserRoleService).deleteAllRoles(eq(USER_ID));
        verify(userInvitationRepository).findByUserEntityAndStatus(eq(capturedUser), eq(UserInvitationStatus.NEW));

        ArgumentCaptor<Set<UserInvitationEntity>> capturedInvitations = ArgumentCaptor.forClass(Set.class);
        verify(userInvitationRepository).saveAll(capturedInvitations.capture());
        Set<UserInvitationEntity> declinedInvitations = capturedInvitations.getValue();
        declinedInvitations.forEach(declinedInvitation -> {
            assertEquals(UserInvitationStatus.DECLINED, declinedInvitation.getStatus());
            assertEquals("User was banned", declinedInvitation.getDeclinationReason());
        });
    }

    @Test
    public void shouldThrowEntityNotFoundExceptionWhenUserForBanWasNotFound() {
        assertThrows(EntityNotFoundException.class, () -> userService.manageBanStatus(USER_ID));
    }

    @Test
    public void shouldUnBanUserSuccessfully() {
        UserEntity user = UserTestUtils.getUserEntity();
        user.setBanned(true);
        user.setActivated(false);

        when(userRepository.findById(anyLong())).thenReturn(Optional.of(user));
        when(userRepository.save(any(UserEntity.class))).thenReturn(user);

        userService.manageBanStatus(USER_ID);

        verify(userRepository).findById(eq(USER_ID));
        ArgumentCaptor<UserEntity> userCaptor = ArgumentCaptor.forClass(UserEntity.class);
        verify(userRepository).save(userCaptor.capture());
        UserEntity capturedUser = userCaptor.getValue();
        assertFalse(capturedUser.isBanned());
        assertTrue(capturedUser.isActivated());
    }

    private UserProjection buildUserProjection(User user) {
        UserProjection projection = projectionFactory.createProjection(UserProjection.class);

        projection.setId(user.getId());
        projection.setFirstName(user.getFirstName());
        projection.setLastName(user.getLastName());
        projection.setDateOfBirth(user.getDateOfBirth());
        projection.setCountry(user.getCountry());
        projection.setCity(user.getCity());
        projection.setEmail(user.getEmail());
        projection.setPassword(user.getPassword());
        projection.setIsActivated(user.isActivated());
        projection.setActivatedSince(user.getActivatedSince());
        projection.setAvatar(user.getAvatar());

        return projection;
    }

    private List<OrganizationUserRoleEntity> createOrganizationUserRoles(Long organizationId, UserEntity user, List<Role> roles) {
        return LongStream.range(0, roles.size())
            .mapToObj(roleId -> {
                OrganizationUserRoleEntityPK primaryKey =
                    new OrganizationUserRoleEntityPK(user.getId(), roleId, organizationId);
                RoleEntity roleEntity = new RoleEntity();
                roleEntity.setId(roleId);
                roleEntity.setRole(roles.get((int) roleId));

                OrganizationUserRoleEntity orgUserRole = new OrganizationUserRoleEntity();
                orgUserRole.setId(primaryKey);
                orgUserRole.setRoleEntity(roleEntity);
                return orgUserRole;
            }).collect(Collectors.toList());
    }

    private OrganizationUserRoleProjection buildOrganizationUserRoleProjection(Long organizationId, User user,
                                                                               Role role, boolean isActive) {
        RoleEntity roleEntity = new RoleEntity();
        roleEntity.setRole(role);

        OrganizationUserRoleProjection projection = projectionFactory.createProjection(OrganizationUserRoleProjection.class);
        projection.setOrganizationId(organizationId);
        projection.setUserId(user.getId());
        projection.setRoleEntity(roleEntity);
        projection.setIsActive(isActive);
        return projection;
    }

    private OrganizationUserRoleEntity buildOrganizationUserRole(Long organizationId, UserEntity user,
                                                                 RoleEntity role, boolean isActive) {
        OrganizationUserRoleEntity organizationUserRole = new OrganizationUserRoleEntity();
        OrganizationUserRoleEntityPK userRolePK = new OrganizationUserRoleEntityPK(user.getId(), role.getId(), organizationId);
        organizationUserRole.setId(userRolePK);
        organizationUserRole.setUserEntity(user);
        organizationUserRole.setRoleEntity(role);
        organizationUserRole.setActive(isActive);
        return organizationUserRole;
    }

    private RoleEntity buildRoleEntity(Role role) {
        RoleEntity roleEntity = new RoleEntity();
        roleEntity.setRole(role);
        return roleEntity;
    }
}
