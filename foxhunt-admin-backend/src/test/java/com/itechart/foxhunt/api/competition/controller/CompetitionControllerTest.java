package com.itechart.foxhunt.api.competition.controller;

import com.itechart.foxhunt.api.auth.security.LoggedUserService;
import com.itechart.foxhunt.api.competition.CompetitionInvitationStatus;
import com.itechart.foxhunt.api.competition.dto.CompetitionInvitation;
import com.itechart.foxhunt.api.competition.service.CompetitionService;
import com.itechart.foxhunt.api.core.ApiConstants;
import com.itechart.foxhunt.api.core.OrganizationId;
import com.itechart.foxhunt.api.user.dto.User;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith({MockitoExtension.class, SpringExtension.class})
@ContextConfiguration(classes = CompetitionController.class)
public class CompetitionControllerTest {

    @MockBean
    CompetitionService competitionService;

    @MockBean
    LoggedUserService loggedUserService;

    @Autowired
    CompetitionController competitionController;

    @Test
    void expectReturnsCreatedCompetitionInvitationWhenTrainerInvitesParticipant() {
        //given
        OrganizationId organizationId = new OrganizationId(1L);
        Long competitionId = 15L;
        Long loggedUserId = 1L;
        Long invitedParticipantId = 2L;

        var expectedReturnedInvitation = createCompetitionInvitation(competitionId, invitedParticipantId);
        expectedReturnedInvitation.setSource(ApiConstants.SOURCE_PARTICIPANT);
        expectedReturnedInvitation.setStatus(CompetitionInvitationStatus.PENDING);

        //when
        when(loggedUserService.getLoggedUserId()).thenReturn(loggedUserId);
        when(competitionService
            .subscribe(organizationId.getId(), competitionId, invitedParticipantId, ApiConstants.SOURCE_TRAINER))
            .thenReturn(expectedReturnedInvitation);

        //then
        var returnedInvitation = competitionController.subscribe(competitionId, invitedParticipantId, organizationId);
        assertEquals(ResponseEntity.status(HttpStatus.CREATED).body(expectedReturnedInvitation), returnedInvitation);
    }

    @Test
    void expectReturnsCreatedCompetitionInvitationWhenParticipantsAppliesToCompetition() {
        //given
        OrganizationId organizationId = new OrganizationId(1L);
        Long competitionId = 15L;
        Long loggedUserId = 1L;

        var expectedReturnedInvitation = createCompetitionInvitation(competitionId, loggedUserId);
        expectedReturnedInvitation.setSource(ApiConstants.SOURCE_PARTICIPANT);
        expectedReturnedInvitation.setStatus(CompetitionInvitationStatus.PENDING);

        //when
        when(loggedUserService.getLoggedUserId()).thenReturn(loggedUserId);
        when(competitionService
            .subscribe(organizationId.getId(), competitionId, loggedUserId, ApiConstants.SOURCE_PARTICIPANT))
            .thenReturn(expectedReturnedInvitation);

        //then
        var returnedInvitation = competitionController.subscribe(competitionId, organizationId);
        assertEquals(ResponseEntity.status(HttpStatus.CREATED).body(expectedReturnedInvitation), returnedInvitation);
    }

    @Test
    void expectReturnsAcceptedCompetitionInvitationWhenParticipantAcceptsInvitation() {
        //given
        OrganizationId organizationId = new OrganizationId(1L);
        Long competitionId = 15L;
        Long loggedUserId = 1L;

        var expectedReturnedInvitation = createCompetitionInvitation(competitionId, loggedUserId);
        expectedReturnedInvitation.setSource(ApiConstants.SOURCE_TRAINER);
        expectedReturnedInvitation.setStatus(CompetitionInvitationStatus.ACCEPTED);

        //when
        when(loggedUserService.getLoggedUserId()).thenReturn(loggedUserId);
        when(competitionService
            .acceptInvitation(organizationId.getId(), competitionId, loggedUserId, ApiConstants.SOURCE_PARTICIPANT))
            .thenReturn(expectedReturnedInvitation);

        //then
        var returnedInvitation = competitionController.acceptInvitation(competitionId, organizationId);
        assertEquals(ResponseEntity.ok(expectedReturnedInvitation), returnedInvitation);
        assertEquals(CompetitionInvitationStatus.ACCEPTED, returnedInvitation.getBody().getStatus());
    }

    @Test
    void expectReturnsDeclinedCompetitionInvitation() {
        //given
        Long competitionId = 15L;
        Long loggedUserId = 1L;

        var expectedReturnedInvitation = createCompetitionInvitation(competitionId, loggedUserId);
        expectedReturnedInvitation.setSource(ApiConstants.SOURCE_TRAINER);
        expectedReturnedInvitation.setStatus(CompetitionInvitationStatus.DECLINED);

        //when
        when(loggedUserService.getLoggedUserId()).thenReturn(loggedUserId);
        when(competitionService.declineInvitation(competitionId, loggedUserId)).thenReturn(expectedReturnedInvitation);

        //then
        var returnedInvitation = competitionController.declineInvitation(competitionId, loggedUserId);
        assertEquals(ResponseEntity.ok(expectedReturnedInvitation), returnedInvitation);
        assertEquals(CompetitionInvitationStatus.DECLINED, returnedInvitation.getBody().getStatus());
    }

    @Test
    void expectPermanentlyDeclinesCompetitionInvitation() {
        //given
        OrganizationId organizationId = new OrganizationId(1L);
        Long competitionId = 15L;
        Long loggedUserId = 1L;

        var expectedReturnedInvitation = createCompetitionInvitation(competitionId, loggedUserId);
        expectedReturnedInvitation.setSource(ApiConstants.SOURCE_TRAINER);
        expectedReturnedInvitation.setStatus(CompetitionInvitationStatus.PERMANENTLY_DECLINED);

        //when
        when(loggedUserService.getLoggedUserId()).thenReturn(loggedUserId);

        //then
        var declinationResponse =
            competitionController.declineInvitationPermanently(competitionId, loggedUserId, organizationId);
        verify(competitionService).declineInvitationPermanently(organizationId.getId(), competitionId, loggedUserId);
        assertEquals(ResponseEntity.ok().build(), declinationResponse);
    }

    private CompetitionInvitation createCompetitionInvitation(Long competitionId, Long participantId) {
        var invitedUser = new User();
        invitedUser.setId(participantId);

        CompetitionInvitation competitionInvitation = new CompetitionInvitation();
        competitionInvitation.setCompetitionId(competitionId);
        competitionInvitation.setParticipant(invitedUser);
        return competitionInvitation;
    }

}
