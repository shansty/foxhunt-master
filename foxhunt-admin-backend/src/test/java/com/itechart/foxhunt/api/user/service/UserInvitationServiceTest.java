package com.itechart.foxhunt.api.user.service;

import com.itechart.foxhunt.api.organization.Organization;
import com.itechart.foxhunt.api.organization.OrganizationService;
import com.itechart.foxhunt.api.user.dao.OrganizationUserRoleRepository;
import com.itechart.foxhunt.api.user.dao.RoleRepository;
import com.itechart.foxhunt.api.user.dao.UserInvitationRepository;
import com.itechart.foxhunt.api.user.dao.UserRepository;
import com.itechart.foxhunt.api.user.dto.InvitationDeclineReason;
import com.itechart.foxhunt.api.user.dto.OrganizationUserRoleShortDto;
import com.itechart.foxhunt.api.user.dto.User;
import com.itechart.foxhunt.api.user.dto.UserInvitation;
import com.itechart.foxhunt.api.user.email.invitation.InvitationProcessingServiceImpl;
import com.itechart.foxhunt.api.user.email.invitation.ParticipantInvitationEmailHandler;
import com.itechart.foxhunt.api.user.email.invitation.SupervisorInvitationEmailHandler;
import com.itechart.foxhunt.api.user.mapper.UserInvitationMapper;
import com.itechart.foxhunt.api.user.mapper.UserInvitationMapperImpl;
import com.itechart.foxhunt.api.user.mapper.UserMapper;
import com.itechart.foxhunt.api.user.mapper.UserMapperImpl;
import com.itechart.foxhunt.api.user.service.validator.UserValidator;
import com.itechart.foxhunt.api.user.util.UserTestUtils;
import com.itechart.foxhunt.domain.entity.UserEntity;
import com.itechart.foxhunt.domain.entity.UserInvitationEntity;
import com.itechart.foxhunt.domain.enums.OrganizationStatus;
import com.itechart.foxhunt.domain.enums.Role;
import com.itechart.foxhunt.domain.enums.UserInvitationStatus;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import javax.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.LongStream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith({MockitoExtension.class, SpringExtension.class})
@ContextConfiguration(classes = {
    UserInvitationServiceImpl.class, UserInvitationMapperImpl.class, UserMapperImpl.class, UserValidator.class
})
public class UserInvitationServiceTest {

    @MockBean
    OrganizationUserRoleService organizationUserRoleService;

    @MockBean
    UserInvitationRepository userInvitationRepository;

    @MockBean
    OrganizationUserRoleRepository organizationUserRoleRepository;

    @MockBean
    RoleRepository roleRepository;

    @MockBean
    UserService userService;

    @MockBean
    UserRepository userRepository;

    @MockBean
    SupervisorInvitationEmailHandler supervisorInvitationEmailHandler;

    @MockBean
    ParticipantInvitationEmailHandler participantInvitationEmailHandler;

    @MockBean
    OrganizationService organizationService;

    @MockBean
    InvitationProcessingServiceImpl invitationProcessingService;

    @Autowired
    UserInvitationMapper userInvitationMapper;

    @Autowired
    UserMapper userMapper;

    @Autowired
    UserInvitationService userInvitationService;

    @Autowired
    private UserValidator userValidator;

    @Test
    void expectReturnsAllInvitationsPaginated() {
        //given
        UserEntity invitedUser = userMapper.domainToEntity(UserTestUtils.getUser());

        List<Long> orgIds = LongStream.rangeClosed(1, 3).boxed().toList();
        List<UserInvitationEntity> invitationsToReturnFromDb = orgIds.stream()
            .map(organizationId -> {
                UserInvitationEntity entity =
                    UserTestUtils.buildUserInvitationEntity(organizationId, invitedUser);
                entity.setStatus(UserInvitationStatus.NEW);
                entity.setStartDate(LocalDateTime.now());
                entity.setEndDate(LocalDateTime.now().plusDays(1));
                return entity;
            }).collect(Collectors.toList());

        Map<Long, Organization> organizationsByIds = orgIds.stream().map(id -> {
            Organization invitationOrganization = createOrganization();
            invitationOrganization.setId(id);
            return invitationOrganization;
        }).collect(Collectors.toMap(Organization::getId, organization -> organization));

        List<UserInvitation> expectedReturnedInvitations = invitationsToReturnFromDb.stream().map(invitation -> {
            UserInvitation invitationDto = userInvitationMapper.entityToDomain(invitation);
            invitationDto.setOrganization(organizationsByIds.get(invitation.getOrganizationId()));
            return invitationDto;
        }).collect(Collectors.toList());

        Pageable pageable = PageRequest.of(0, 10);
        PageImpl<UserInvitationEntity> invitationsPageToReturnFromDb =
            new PageImpl<>(invitationsToReturnFromDb, pageable, invitationsToReturnFromDb.size());

        //when
        when(userInvitationRepository.findAll(pageable))
            .thenReturn(invitationsPageToReturnFromDb);
        when(organizationService.getAll(any())).thenReturn(new ArrayList<>(organizationsByIds.values()));

        //then
        List<UserInvitation> returnedInvitations = userInvitationService.getAll(pageable);
        assertEquals(expectedReturnedInvitations, returnedInvitations);
    }

    @Test
    void expectProcessAcceptedResponseOnInvitationIntoActivatedOrganization() {
        //given
        UserInvitationStatus acceptedStatus = UserInvitationStatus.ACCEPTED;
        String token = UUID.randomUUID().toString();
        String orgDomain = "pravda";
        LocalDateTime invitationEndDate = LocalDateTime.now().plusDays(1);
        LocalDateTime invitationTransactionDate = LocalDateTime.now();

        Organization invitationOrganization = createOrganization();
        Long organizationId = 1L;
        invitationOrganization.setId(organizationId);
        invitationOrganization.setOrganizationDomain(orgDomain);
        invitationOrganization.setStatus(OrganizationStatus.ACTIVE);

        UserEntity invitedUser = userMapper.domainToEntity(UserTestUtils.getUser());

        UserInvitationEntity invitationToProcess =
            UserTestUtils.buildUserInvitationEntity(organizationId, invitedUser);
        invitationToProcess.setToken(token);
        invitationToProcess.setEndDate(invitationEndDate);
        invitationToProcess.setStatus(UserInvitationStatus.NEW);

        User expectedReturnedUser = userMapper.entityToDomain(invitedUser);
        expectedReturnedUser.setRoles(Set.of(buildUserRoleDto(organizationId, invitedUser.getId(), Role.TRAINER, true)));
        UserInvitation expectedProcessedInvitation =
            userInvitationMapper.entityToDomain(invitationToProcess, invitationOrganization);
        expectedProcessedInvitation.setToken(token);
        expectedProcessedInvitation.setUser(expectedReturnedUser);
        expectedProcessedInvitation.setTransitionDate(invitationTransactionDate);
        expectedProcessedInvitation.setStatus(acceptedStatus);

        //when
        when(organizationService.findOrganizationByDomain(orgDomain))
            .thenReturn(invitationOrganization);
        List<UserInvitationStatus> validInvitationStatuses = List.of(UserInvitationStatus.NEW, UserInvitationStatus.EXPIRED);
        when(userInvitationRepository.findByTokenAndStatusInAndOrganizationId(
            eq(token),
            argThat(passedStatuses -> passedStatuses.containsAll(validInvitationStatuses)),
            eq(organizationId))
        ).thenReturn(Optional.of(invitationToProcess));

        UserInvitationEntity savedInvitation = UserTestUtils.buildUserInvitationEntity(organizationId, invitedUser);
        savedInvitation.setToken(token);
        savedInvitation.setEndDate(invitationEndDate);
        savedInvitation.setStatus(UserInvitationStatus.ACCEPTED);
        savedInvitation.setTransitionDate(invitationTransactionDate);
        when(userInvitationRepository.save(any())).thenReturn(savedInvitation);
        when(userService.findById(invitedUser.getId(), organizationId)).thenReturn(expectedReturnedUser);

        //then
        UserInvitation processedInvitation = userInvitationService.processUserResponseOnInvitation(orgDomain, token, acceptedStatus);
        assertEquals(expectedProcessedInvitation, processedInvitation);
    }

    @Test
    void expectProcessAcceptedResponseOnInvitationIntoNotActivatedOrganization() {
        //given
        UserInvitationStatus acceptedStatus = UserInvitationStatus.ACCEPTED;
        String token = UUID.randomUUID().toString();
        String orgDomain = "pravda";
        LocalDateTime invitationEndDate = LocalDateTime.now().plusDays(1);
        LocalDateTime invitationTransactionDate = LocalDateTime.now();

        Organization invitationOrganization = createOrganization();
        Long organizationId = 1L;
        invitationOrganization.setId(organizationId);
        invitationOrganization.setOrganizationDomain(orgDomain);
        invitationOrganization.setStatus(OrganizationStatus.NEW);

        UserEntity invitedUser = userMapper.domainToEntity(UserTestUtils.getUser());

        UserInvitationEntity invitationToProcess =
            UserTestUtils.buildUserInvitationEntity(organizationId, invitedUser);
        invitationToProcess.setToken(token);
        invitationToProcess.setEndDate(invitationEndDate);
        invitationToProcess.setStatus(UserInvitationStatus.NEW);

        User expectedReturnedUser = userMapper.entityToDomain(invitedUser);
        expectedReturnedUser.setRoles(Set.of(buildUserRoleDto(organizationId, invitedUser.getId(), Role.TRAINER, true)));
        UserInvitation expectedProcessedInvitation =
            userInvitationMapper.entityToDomain(invitationToProcess, invitationOrganization);
        expectedProcessedInvitation.setToken(token);
        expectedProcessedInvitation.setUser(expectedReturnedUser);
        expectedProcessedInvitation.setTransitionDate(invitationTransactionDate);
        expectedProcessedInvitation.setStatus(acceptedStatus);

        //when
        when(organizationService.findOrganizationByDomain(orgDomain))
            .thenReturn(invitationOrganization);
        List<UserInvitationStatus> validInvitationStatuses = List.of(UserInvitationStatus.NEW, UserInvitationStatus.EXPIRED);
        when(userInvitationRepository.findByTokenAndStatusInAndOrganizationId(
            eq(token),
            argThat(passedStatuses -> passedStatuses.containsAll(validInvitationStatuses)),
            eq(organizationId))
        ).thenReturn(Optional.of(invitationToProcess));

        UserInvitationEntity savedInvitation = UserTestUtils.buildUserInvitationEntity(organizationId, invitedUser);
        savedInvitation.setToken(token);
        savedInvitation.setEndDate(invitationEndDate);
        savedInvitation.setStatus(acceptedStatus);
        savedInvitation.setTransitionDate(invitationTransactionDate);
        when(userInvitationRepository.save(any())).thenReturn(savedInvitation);
        when(userService.findById(invitedUser.getId(), organizationId)).thenReturn(expectedReturnedUser);

        //then
        UserInvitation processedInvitation = userInvitationService.processUserResponseOnInvitation(orgDomain, token, acceptedStatus);
        assertEquals(expectedProcessedInvitation, processedInvitation);
    }

    @Test
    void expectEntityNotFoundExceptionWhenUnableToFindInvitationOrganization() {
        //given
        UserInvitationStatus acceptedStatus = UserInvitationStatus.ACCEPTED;
        String token = UUID.randomUUID().toString();
        String orgDomain = "pravda";

        when(organizationService.findOrganizationByDomain(orgDomain))
            .thenThrow(EntityNotFoundException.class);
        //then
        assertThrows(EntityNotFoundException.class,
            () -> userInvitationService.processUserResponseOnInvitation(orgDomain, token, acceptedStatus));
    }

    @Test
    void expectEntityNotFoundExceptionWhenUnableToFindInvitation() {
        //given
        UserInvitationStatus acceptedStatus = UserInvitationStatus.ACCEPTED;
        String token = UUID.randomUUID().toString();
        String orgDomain = "pravda";

        Organization invitationOrganization = createOrganization();
        Long organizationId = 1L;
        invitationOrganization.setId(organizationId);
        invitationOrganization.setOrganizationDomain(orgDomain);
        invitationOrganization.setStatus(OrganizationStatus.ACTIVE);

        //when
        when(organizationService.findOrganizationByDomain(orgDomain))
            .thenReturn(invitationOrganization);
        when(userInvitationRepository.findByTokenAndStatusInAndOrganizationId(token, List.of(UserInvitationStatus.NEW), organizationId))
            .thenThrow(EntityNotFoundException.class);

        //then
        assertThrows(EntityNotFoundException.class,
            () -> userInvitationService.processUserResponseOnInvitation(orgDomain, token, acceptedStatus));
    }

    @Test
    void expectReturnsExpiredInvitationWhenInvitationProcessedAfterExpirationDate() {
        //given
        UserInvitationStatus acceptedStatus = UserInvitationStatus.ACCEPTED;
        String token = UUID.randomUUID().toString();
        String orgDomain = "pravda";
        LocalDateTime invitationEndDate = LocalDateTime.now().minusDays(1);

        Organization invitationOrganization = createOrganization();
        Long organizationId = 1L;
        invitationOrganization.setId(organizationId);
        invitationOrganization.setOrganizationDomain(orgDomain);
        invitationOrganization.setStatus(OrganizationStatus.ACTIVE);

        UserEntity invitedUser = userMapper.domainToEntity(UserTestUtils.getUser());

        UserInvitationEntity invitationToProcess =
            UserTestUtils.buildUserInvitationEntity(organizationId, invitedUser);
        invitationToProcess.setToken(token);
        invitationToProcess.setEndDate(invitationEndDate);
        invitationToProcess.setStatus(UserInvitationStatus.NEW);

        User expectedReturnedUser = userMapper.entityToDomain(invitedUser);
        expectedReturnedUser.setRoles(Set.of(buildUserRoleDto(organizationId, invitedUser.getId(), Role.TRAINER, true)));
        UserInvitation expectedProcessedInvitation =
            userInvitationMapper.entityToDomain(invitationToProcess, invitationOrganization);
        expectedProcessedInvitation.setToken(token);
        expectedProcessedInvitation.setUser(expectedReturnedUser);
        expectedProcessedInvitation.setStatus(UserInvitationStatus.EXPIRED);

        //when
        when(organizationService.findOrganizationByDomain(orgDomain))
            .thenReturn(invitationOrganization);
        List<UserInvitationStatus> validInvitationStatuses = List.of(UserInvitationStatus.NEW, UserInvitationStatus.EXPIRED);
        when(userInvitationRepository.findByTokenAndStatusInAndOrganizationId(
            eq(token),
            argThat(passedStatuses -> passedStatuses.containsAll(validInvitationStatuses)),
            eq(organizationId))
        ).thenReturn(Optional.of(invitationToProcess));

        UserInvitationEntity savedInvitation = UserTestUtils.buildUserInvitationEntity(organizationId, invitedUser);
        savedInvitation.setToken(token);
        savedInvitation.setEndDate(invitationEndDate);
        savedInvitation.setStatus(UserInvitationStatus.EXPIRED);
        when(userInvitationRepository.save(any())).thenReturn(savedInvitation);
        when(userService.findById(invitedUser.getId(), organizationId)).thenReturn(expectedReturnedUser);

        //then
        assertEquals(expectedProcessedInvitation, userInvitationService.processUserResponseOnInvitation(orgDomain, token, acceptedStatus));
        verify(userInvitationRepository).save(invitationToProcess);
    }

    @Test
    void expectSetDeclineReasonForUserInvitation() {
        //given
        String invitationToken = UUID.randomUUID().toString();
        UserInvitationEntity userEntityFromDb = new UserInvitationEntity();
        InvitationDeclineReason expectedDeclineReason = getDeclineReason();

        //when
        when(userInvitationRepository.findByTokenAndStatus(invitationToken, UserInvitationStatus.DECLINED))
            .thenReturn(Optional.of(userEntityFromDb));
        when(userInvitationRepository.save(any())).thenReturn(userEntityFromDb);

        //then
        InvitationDeclineReason declineReason = userInvitationService.setDeclineReason(invitationToken, expectedDeclineReason);
        assertEquals(expectedDeclineReason, declineReason);
    }

    @Test
    void expectEntityNotFoundExceptionWhenDeclinedUserInvitationWithProvidedTokenNotFoundInDatabase() {
        //given
        String invitationToken = UUID.randomUUID().toString();
        InvitationDeclineReason expectedDeclineReason = getDeclineReason();

        //when
        when(userInvitationRepository.findByTokenAndStatus(invitationToken, UserInvitationStatus.DECLINED))
            .thenReturn(Optional.empty());

        //then
        assertThrows(EntityNotFoundException.class, () -> userInvitationService.setDeclineReason(invitationToken, expectedDeclineReason));
    }

    @Test
    void expectIllegalArgumentExceptionWhenDeclineReasonAlreadySet() {
        //given
        String invitationToken = UUID.randomUUID().toString();
        UserInvitationEntity userEntityFromDb = new UserInvitationEntity();
        userEntityFromDb.setDeclinationReason("Already defined decline reason");
        InvitationDeclineReason expectedDeclineReason = getDeclineReason();

        //when
        when(userInvitationRepository.findByTokenAndStatus(invitationToken, UserInvitationStatus.DECLINED))
            .thenReturn(Optional.of(userEntityFromDb));

        //then
        assertThrows(IllegalArgumentException.class, () -> userInvitationService.setDeclineReason(invitationToken, expectedDeclineReason));
    }

    private OrganizationUserRoleShortDto buildUserRoleDto(Long organizationId, Long userId, Role role, boolean isActive) {
        return new OrganizationUserRoleShortDto(organizationId, userId, role, isActive);
    }

    private Organization createOrganization() {
        Organization organization = new Organization();
        organization.setId(1L);
        organization.setName("Radio School");
        return organization;
    }

    private InvitationDeclineReason getDeclineReason() {
        InvitationDeclineReason invitationDeclineReason = new InvitationDeclineReason();
        invitationDeclineReason.setDeclinationReason("Default reason to decline invitation");

        return invitationDeclineReason;
    }

}

