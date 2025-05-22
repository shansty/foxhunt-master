package com.itechart.foxhunt.api.user.controller;

import com.itechart.foxhunt.api.organization.Organization;
import com.itechart.foxhunt.api.user.dto.InvitationDeclineReason;
import com.itechart.foxhunt.api.user.dto.UserInvitation;
import com.itechart.foxhunt.api.user.dto.UserInvitationShortDto;
import com.itechart.foxhunt.api.user.mapper.UserInvitationMapper;
import com.itechart.foxhunt.api.user.mapper.UserInvitationMapperImpl;
import com.itechart.foxhunt.api.user.mapper.UserMapper;
import com.itechart.foxhunt.api.user.mapper.UserMapperImpl;
import com.itechart.foxhunt.api.user.service.UserInvitationService;
import com.itechart.foxhunt.api.user.util.UserTestUtils;
import com.itechart.foxhunt.domain.entity.RoleEntity;
import com.itechart.foxhunt.domain.entity.UserEntity;
import com.itechart.foxhunt.domain.entity.UserInvitationEntity;
import com.itechart.foxhunt.domain.enums.Role;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import javax.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.LongStream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith({MockitoExtension.class, SpringExtension.class})
@ContextConfiguration(classes = {
    UserInvitationController.class, UserMapperImpl.class, UserInvitationMapperImpl.class
})
public class UserInvitationControllerTest {

    @MockBean
    UserInvitationService userInvitationService;

    @Autowired
    UserMapper userMapper;

    @Autowired
    UserInvitationMapper userInvitationMapper;

    @Autowired
    UserInvitationController userInvitationController;

    @Test
    void expectReturnsAllInvitationsPaginated() {
        //given
        UserEntity invitedUser = userMapper.domainToEntity(UserTestUtils.getUser());

        List<Long> orgIds = LongStream.rangeClosed(1, 3).boxed().collect(Collectors.toList());
        Map<Long, Organization> organizationsByIds = orgIds.stream().map(id -> {
            Organization invitationOrganization = createOrganization();
            invitationOrganization.setId(id);
            return invitationOrganization;
        }).collect(Collectors.toMap(Organization::getId, organization -> organization));

        List<UserInvitation> invitationsFromService = orgIds.stream()
            .map(organizationId -> {
                UserInvitationEntity invitationEntity =
                    UserTestUtils.buildUserInvitationEntity(organizationId, invitedUser);
                UserInvitation invitationDto = userInvitationMapper.entityToDomain(invitationEntity);
                invitationDto.setOrganization(organizationsByIds.get(organizationId));
                return invitationDto;
            })
            .collect(Collectors.toList());

        List<UserInvitationShortDto> expectedReturnedInvitations = invitationsFromService.stream()
            .map(userInvitationMapper::convertToShortDto)
            .collect(Collectors.toList());

        Pageable pageable = PageRequest.of(0, 10);

        //when
        when(userInvitationService.getAll(pageable)).thenReturn(invitationsFromService);

        //then
        ResponseEntity<List<UserInvitationShortDto>> getInvitationsResponse = userInvitationController.getAll(pageable);
        assertEquals(ResponseEntity.ok(expectedReturnedInvitations), getInvitationsResponse);
    }

    @Test
    void expectSetDeclineReasonForUserInvitation() {
        //given
        String invitationUUID = UUID.randomUUID().toString();
        InvitationDeclineReason declineReason = getDeclineReason();

        //when
        when(userInvitationService.setDeclineReason(invitationUUID, declineReason))
            .thenReturn(declineReason);

        //then
        ResponseEntity<InvitationDeclineReason> setDeclineReasonResponse = userInvitationController.setDeclineInvitationReason(invitationUUID, declineReason);
        assertEquals(ResponseEntity.ok(declineReason), setDeclineReasonResponse);
    }

    @Test
    void expectEntityNotFoundExceptionWhenDeclinedUserInvitationWithProvidedTokenNotFoundInDatabase() {
        //given
        String invitationUUID = UUID.randomUUID().toString();
        InvitationDeclineReason declineReason = getDeclineReason();

        //when
        when(userInvitationService.setDeclineReason(invitationUUID, declineReason))
            .thenThrow(new EntityNotFoundException());

        //then
        assertThrows(EntityNotFoundException.class, () -> userInvitationController.setDeclineInvitationReason(invitationUUID, declineReason));
    }

    @Test
    void expectIllegalArgumentExceptionWhenDeclineReasonAlreadySet() {
        //given
        String invitationUUID = UUID.randomUUID().toString();
        InvitationDeclineReason declineReason = getDeclineReason();

        //when
        when(userInvitationService.setDeclineReason(invitationUUID, declineReason))
            .thenThrow(new IllegalArgumentException());

        //then
        assertThrows(IllegalArgumentException.class, () -> userInvitationController.setDeclineInvitationReason(invitationUUID, declineReason));
    }

    public InvitationDeclineReason getDeclineReason() {
        InvitationDeclineReason invitationDeclineReason = new InvitationDeclineReason();
        invitationDeclineReason.setDeclinationReason("Default reason to decline invitation");

        return invitationDeclineReason;
    }

    private Organization createOrganization() {
        Organization organization = new Organization();
        organization.setId(1L);
        organization.setName("Radio School");
        return organization;
    }

}
