package com.itechart.foxhunt.api.competition.service;

import com.itechart.foxhunt.api.auth.security.LoggedUserService;
import com.itechart.foxhunt.api.competition.CompetitionInvitationStatus;
import com.itechart.foxhunt.api.competition.dto.Competition;
import com.itechart.foxhunt.api.competition.dto.ModifyCompetition;
import com.itechart.foxhunt.api.competition.entity.CompetitionInvitationEntity;
import com.itechart.foxhunt.api.competition.mapper.CompetitionInvitationMapperImpl;
import com.itechart.foxhunt.api.competition.mapper.CompetitionLocationMapperImpl;
import com.itechart.foxhunt.api.competition.mapper.CompetitionMapper;
import com.itechart.foxhunt.api.competition.mapper.CompetitionMapperImpl;
import com.itechart.foxhunt.api.competition.mapper.ModifyCompetitionMapper;
import com.itechart.foxhunt.api.competition.mapper.ModifyCompetitionMapperImpl;
import com.itechart.foxhunt.api.competition.projection.ProjectionResolver;
import com.itechart.foxhunt.api.competition.repository.CompetitionInvitationRepository;
import com.itechart.foxhunt.api.competition.repository.CompetitionParticipantRepository;
import com.itechart.foxhunt.api.competition.repository.CompetitionRepository;
import com.itechart.foxhunt.api.competition.util.CompetitionTestUtils;
import com.itechart.foxhunt.api.core.ApiConstants;
import com.itechart.foxhunt.api.organization.OrganizationService;
import com.itechart.foxhunt.api.user.dao.RoleRepository;
import com.itechart.foxhunt.api.user.dao.UserRepository;
import com.itechart.foxhunt.api.user.dto.User;
import com.itechart.foxhunt.api.user.service.UserService;
import com.itechart.foxhunt.domain.entity.CompetitionEntity;
import com.itechart.foxhunt.domain.entity.UserEntity;
import com.itechart.foxhunt.domain.enums.CompetitionStatus;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import javax.persistence.EntityNotFoundException;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.AdditionalAnswers.returnsFirstArg;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith({MockitoExtension.class, SpringExtension.class})
@ContextConfiguration(classes = {
    CompetitionServiceImpl.class, CompetitionMapperImpl.class, ModifyCompetitionMapperImpl.class,
    CompetitionInvitationMapperImpl.class,
    CompetitionLocationMapperImpl.class
})
@MockitoSettings(strictness = Strictness.LENIENT)
public class CompetitionServiceTest {

    @MockBean
    CompetitionValidationService competitionValidationService;

    @MockBean
    ProjectionResolver projectionResolver;

    @MockBean
    CompetitionRepository competitionRepository;

    @MockBean
    CompetitionInvitationRepository competitionInvitationRepository;

    @MockBean
    CompetitionParticipantRepository competitionParticipantRepository;

    @Autowired
    CompetitionMapper competitionMapper;

    @Autowired
    ModifyCompetitionMapper modifyCompetitionMapper;

    @MockBean
    LoggedUserService loggedUserService;

    @MockBean
    UserRepository userRepository;

    @MockBean
    RoleRepository roleRepository;

    @MockBean
    OrganizationService organizationService;

    @MockBean
    UserService userService;

    @Autowired
    CompetitionService competitionService;

    @Test
    public void expectCreatesCompetitionInProvidedOrganization() {
        //given
        Long organizationId = 1L;

        ModifyCompetition competitionToCreate = getModifyCompetitionDto();

        UserEntity loggedUser = getUser();
        Long competitionCoachId = 2L;
        UserEntity competitionCoach = getUser();
        competitionCoach.setId(competitionCoachId);

        CompetitionEntity expectedCompetitionEntity = modifyCompetitionMapper.domainToEntity(competitionToCreate);
        expectedCompetitionEntity.setOrganizationId(organizationId);
        expectedCompetitionEntity.setCreatedBy(competitionCoach);
        expectedCompetitionEntity.setStatus(CompetitionStatus.SCHEDULED);
        expectedCompetitionEntity.setCreatedBy(loggedUser);
        Competition expectedCreatedCompetition = competitionMapper.entityToDomain(expectedCompetitionEntity);

        //when
        when(loggedUserService.getLoggedUserEntity()).thenReturn(loggedUser);
        when(userRepository.getById(competitionCoachId)).thenReturn(competitionCoach);
        when(competitionRepository.save(expectedCompetitionEntity)).thenReturn(expectedCompetitionEntity);

        //then
        Competition createdCompetition = competitionService.create(competitionToCreate, organizationId);

        verify(competitionValidationService).validateCreateCompetition(organizationId, competitionToCreate);
        verify(competitionRepository).save(any());
        assertEquals(expectedCreatedCompetition, createdCompetition);
    }

    @Test
    public void expectEntityNotFoundExceptionWhenUnableToFindProvidedCoach() {
        //given
        Long organizationId = 1L;
        Long competitionCoachId = 2L;
        ModifyCompetition competitionToCreate = getModifyCompetitionDto();
        competitionToCreate.setCoachId(competitionCoachId);

        //when
        when(loggedUserService.getLoggedUserEntity()).thenReturn(getUser());
        when(userRepository.getById(competitionCoachId)).thenThrow(new EntityNotFoundException());

        //then
        assertThrows(EntityNotFoundException.class, () -> competitionService.create(competitionToCreate, organizationId));
    }

    @Test
    void expectCreatesNewCompetitionInvitationWhenParticipantInvitedToCompetitionAtFirstTime() {
        //given
        Long organizationId = 1L;
        Long competitionId = 15L;
        Long participantId = 2L;
        Long coachId = 3L;

        var competitionCoach = competitionMapper.userToUserEntity(createUser(coachId));
        var scheduledCompetition = createCompetitionEntity(organizationId, competitionId);
        scheduledCompetition.setCoach(competitionCoach);
        scheduledCompetition.setIsPrivate(false);

        var userToMakeCompetitionParticipant = createUser(participantId);

        //when
        when(competitionRepository
            .findByIdAndOrganizationIdAndStatus(competitionId, organizationId, CompetitionStatus.SCHEDULED))
            .thenReturn(Optional.of(scheduledCompetition));
        when(userService.findById(participantId, organizationId)).thenReturn(userToMakeCompetitionParticipant);
        when(competitionInvitationRepository.findByCompetitionIdAndParticipantId(competitionId, participantId))
            .thenReturn(Optional.empty());
        when(competitionInvitationRepository.save(any())).then(returnsFirstArg());

        //then
        var invitationCreatedByTrainer =
            competitionService.subscribe(organizationId, competitionId, participantId, ApiConstants.SOURCE_TRAINER);
        assertEquals(ApiConstants.SOURCE_TRAINER, invitationCreatedByTrainer.getSource());
        assertEquals(competitionId, invitationCreatedByTrainer.getCompetitionId());
        assertEquals(participantId, invitationCreatedByTrainer.getParticipant().getId());

        var invitationCreatedByParticipant =
            competitionService.subscribe(organizationId, competitionId, participantId, ApiConstants.SOURCE_PARTICIPANT);
        assertEquals(ApiConstants.SOURCE_PARTICIPANT, invitationCreatedByParticipant.getSource());
        assertEquals(competitionId, invitationCreatedByParticipant.getCompetitionId());
        assertEquals(participantId, invitationCreatedByParticipant.getParticipant().getId());
        assertEquals(CompetitionInvitationStatus.PENDING, invitationCreatedByParticipant.getStatus());
    }

    @Test
    void expectIllegalArgumentExceptionWhenCompetitionCoachInvitesHimself() {
        //given
        Long organizationId = 1L;
        Long competitionId = 15L;
        Long participantId = 2L;
        Long coachId = 2L;

        var competitionCoach = competitionMapper.userToUserEntity(createUser(coachId));
        var scheduledCompetition = createCompetitionEntity(organizationId, competitionId);
        scheduledCompetition.setCoach(competitionCoach);
        scheduledCompetition.setIsPrivate(false);

        var userToMakeCompetitionParticipant = createUser(participantId);

        //when
        when(competitionRepository
            .findByIdAndOrganizationIdAndStatus(competitionId, organizationId, CompetitionStatus.SCHEDULED))
            .thenReturn(Optional.of(scheduledCompetition));
        when(userService.findById(participantId, organizationId)).thenReturn(userToMakeCompetitionParticipant);

        //then
        assertThrows(IllegalArgumentException.class,
            () -> competitionService.subscribe(organizationId, competitionId, coachId, ApiConstants.SOURCE_TRAINER));
    }

    @Test
    void expectIllegalArgumentExceptionWhenParticipantAppliesToPrivateCompetition() {
        //given
        Long organizationId = 1L;
        Long competitionId = 15L;
        Long participantId = 2L;
        Long coachId = 3L;

        var competitionCoach = competitionMapper.userToUserEntity(createUser(coachId));
        var scheduledCompetition = createCompetitionEntity(organizationId, competitionId);
        scheduledCompetition.setCoach(competitionCoach);
        scheduledCompetition.setIsPrivate(true);

        var userToMakeCompetitionParticipant = createUser(participantId);

        //when
        when(competitionRepository
            .findByIdAndOrganizationIdAndStatus(competitionId, organizationId, CompetitionStatus.SCHEDULED))
            .thenReturn(Optional.of(scheduledCompetition));
        when(userService.findById(participantId, organizationId)).thenReturn(userToMakeCompetitionParticipant);

        //then
        assertThrows(IllegalArgumentException.class,
            () -> competitionService.subscribe(organizationId, competitionId, participantId, ApiConstants.SOURCE_PARTICIPANT));
    }

    @Test
    void expectIllegalArgumentExceptionWhenPermanentlyDeclinedParticipantApplyingToCompetition() {
        //given
        Long organizationId = 1L;
        Long competitionId = 15L;
        Long participantId = 2L;
        Long coachId = 3L;

        var competitionCoach = competitionMapper.userToUserEntity(createUser(coachId));
        var scheduledCompetition = createCompetitionEntity(organizationId, competitionId);
        scheduledCompetition.setCoach(competitionCoach);
        scheduledCompetition.setIsPrivate(false);

        var userToMakeCompetitionParticipant = createUser(participantId);

        var participantUserEntity = competitionMapper.userToUserEntity(userToMakeCompetitionParticipant);
        var competitionInvitation = createCompetitionInvitationEntity(scheduledCompetition, participantUserEntity);
        competitionInvitation.setStatus(CompetitionInvitationStatus.PERMANENTLY_DECLINED);

        //when
        when(competitionRepository
            .findByIdAndOrganizationIdAndStatus(competitionId, organizationId, CompetitionStatus.SCHEDULED))
            .thenReturn(Optional.of(scheduledCompetition));
        when(userService.findById(participantId, organizationId)).thenReturn(userToMakeCompetitionParticipant);
        when(competitionInvitationRepository.findByCompetitionIdAndParticipantId(competitionId, participantId))
            .thenReturn(Optional.of(competitionInvitation));

        //then
        assertThrows(IllegalArgumentException.class,
            () -> competitionService.subscribe(organizationId, competitionId, participantId, ApiConstants.SOURCE_PARTICIPANT));
    }

    @Test
    void expectIllegalArgumentExceptionWhenAttemptingPermanentlyDeclineAcceptedInvitation() {
        //given
        Long organizationId = 1L;
        Long competitionId = 15L;
        Long participantId = 2L;
        Long coachId = 3L;

        var competitionCoach = competitionMapper.userToUserEntity(createUser(coachId));
        var scheduledCompetition = createCompetitionEntity(organizationId, competitionId);
        scheduledCompetition.setCoach(competitionCoach);
        scheduledCompetition.setIsPrivate(false);

        var userToMakeCompetitionParticipant = createUser(participantId);

        var participantUserEntity = competitionMapper.userToUserEntity(userToMakeCompetitionParticipant);
        var competitionInvitation = createCompetitionInvitationEntity(scheduledCompetition, participantUserEntity);
        competitionInvitation.setStatus(CompetitionInvitationStatus.ACCEPTED);

        //when
        when(competitionRepository
            .findByIdAndOrganizationIdAndStatus(competitionId, organizationId, CompetitionStatus.SCHEDULED))
            .thenReturn(Optional.of(scheduledCompetition));
        when(userService.findById(participantId, organizationId)).thenReturn(userToMakeCompetitionParticipant);
        when(competitionInvitationRepository.findByCompetitionIdAndParticipantId(competitionId, participantId))
            .thenReturn(Optional.of(competitionInvitation));

        //then
        assertThrows(IllegalArgumentException.class,
            () -> competitionService.subscribe(organizationId, competitionId, participantId, ApiConstants.SOURCE_PARTICIPANT));
    }

    @Test
    void expectUpdatesCompetitionInvitationFromDeclinedToPendingWhenInvitingDeclinedParticipantIntoPublicCompetition() {
        //given
        Long organizationId = 1L;
        Long competitionId = 15L;
        Long participantId = 2L;
        Long coachId = 3L;

        var competitionCoach = competitionMapper.userToUserEntity(createUser(coachId));
        var publicScheduledCompetition = createCompetitionEntity(organizationId, competitionId);
        publicScheduledCompetition.setCoach(competitionCoach);
        publicScheduledCompetition.setIsPrivate(false);

        var userToMakeCompetitionParticipant = createUser(participantId);

        //when
        when(competitionRepository
            .findByIdAndOrganizationIdAndStatus(competitionId, organizationId, CompetitionStatus.SCHEDULED))
            .thenReturn(Optional.of(publicScheduledCompetition));
        when(userService.findById(participantId, organizationId)).thenReturn(userToMakeCompetitionParticipant);
        when(competitionInvitationRepository.findByCompetitionIdAndParticipantId(competitionId, participantId))
            .thenReturn(Optional.empty());
        when(competitionInvitationRepository.save(any())).then(returnsFirstArg());

        //then
        var invitationUpdatedByTrainer =
            competitionService.subscribe(organizationId, competitionId, participantId, ApiConstants.SOURCE_TRAINER);
        assertEquals(ApiConstants.SOURCE_TRAINER, invitationUpdatedByTrainer.getSource());
        assertEquals(competitionId, invitationUpdatedByTrainer.getCompetitionId());
        assertEquals(participantId, invitationUpdatedByTrainer.getParticipant().getId());
        assertEquals(CompetitionInvitationStatus.PENDING, invitationUpdatedByTrainer.getStatus());

        var invitationUpdatedByParticipant =
            competitionService.subscribe(organizationId, competitionId, participantId, ApiConstants.SOURCE_PARTICIPANT);
        assertEquals(ApiConstants.SOURCE_PARTICIPANT, invitationUpdatedByParticipant.getSource());
        assertEquals(competitionId, invitationUpdatedByParticipant.getCompetitionId());
        assertEquals(participantId, invitationUpdatedByParticipant.getParticipant().getId());
        assertEquals(CompetitionInvitationStatus.PENDING, invitationUpdatedByParticipant.getStatus());
    }

    @Test
    void expectIllegalArgumentExceptionWhenInvitingParticipantWithPendingCompetitionInvitation() {
        //given
        Long organizationId = 1L;
        Long competitionId = 15L;
        Long participantId = 2L;
        Long coachId = 3L;

        var competitionCoach = competitionMapper.userToUserEntity(createUser(coachId));
        var publicScheduledCompetition = createCompetitionEntity(organizationId, competitionId);
        publicScheduledCompetition.setCoach(competitionCoach);
        publicScheduledCompetition.setIsPrivate(false);

        var userToMakeCompetitionParticipant = createUser(participantId);

        var participantUserEntity = competitionMapper.userToUserEntity(userToMakeCompetitionParticipant);
        var pendingCompetitionInvitation = createCompetitionInvitationEntity(publicScheduledCompetition, participantUserEntity);
        pendingCompetitionInvitation.setStatus(CompetitionInvitationStatus.PENDING);

        //when
        when(competitionRepository
            .findByIdAndOrganizationIdAndStatus(competitionId, organizationId, CompetitionStatus.SCHEDULED))
            .thenReturn(Optional.of(publicScheduledCompetition));
        when(userService.findById(participantId, organizationId)).thenReturn(userToMakeCompetitionParticipant);
        when(competitionInvitationRepository.findByCompetitionIdAndParticipantId(competitionId, participantId))
            .thenReturn(Optional.of(pendingCompetitionInvitation));

        //then
        assertThrows(IllegalArgumentException.class,
            () -> competitionService.subscribe(organizationId, competitionId, participantId, ApiConstants.SOURCE_TRAINER));
    }

    @Test
    void expectAcceptsCompetitionInvitationAndAddsParticipantToCompetition() {
        //given
        Long organizationId = 1L;
        Long competitionId = 15L;
        Long participantId = 2L;

        var publicScheduledCompetition = createCompetitionEntity(organizationId, competitionId);
        publicScheduledCompetition.setIsPrivate(false);
        var userToAccept = createUser(participantId);
        var participantUserEntity = competitionMapper.userToUserEntity(userToAccept);
        var pendingCompetitionInvitation = createCompetitionInvitationEntity(publicScheduledCompetition, participantUserEntity);
        pendingCompetitionInvitation.setStatus(CompetitionInvitationStatus.PENDING);
        pendingCompetitionInvitation.setSource(ApiConstants.SOURCE_TRAINER);

        //when
        when(competitionRepository
            .findByIdAndOrganizationIdAndStatus(competitionId, organizationId, CompetitionStatus.SCHEDULED))
            .thenReturn(Optional.of(publicScheduledCompetition));
        when(userService.findById(participantId, organizationId)).thenReturn(userToAccept);
        when(competitionInvitationRepository
            .findByCompetitionAndParticipantAndStatus(competitionId, participantId, CompetitionInvitationStatus.PENDING))
            .thenReturn(Optional.of(pendingCompetitionInvitation));
        when(competitionInvitationRepository.save(any())).then(returnsFirstArg());

        //then
        var acceptedInvitation =
            competitionService.acceptInvitation(organizationId, competitionId, participantId, ApiConstants.SOURCE_PARTICIPANT);
        assertEquals(CompetitionInvitationStatus.ACCEPTED, acceptedInvitation.getStatus());
        assertEquals(competitionId, acceptedInvitation.getCompetitionId());
        assertEquals(participantId, acceptedInvitation.getParticipant().getId());
        verify(competitionParticipantRepository).save(any());
    }

    @Test
    void expectEntityNotFoundExceptionWhenUnableToFindPendingCompetitionInvitationToAccept() {
        //given
        Long organizationId = 1L;
        Long competitionId = 15L;
        Long participantId = 2L;

        var publicScheduledCompetition = createCompetitionEntity(organizationId, competitionId);
        publicScheduledCompetition.setIsPrivate(false);
        var userToAccept = createUser(participantId);

        //when
        when(competitionRepository
            .findByIdAndOrganizationIdAndStatus(competitionId, organizationId, CompetitionStatus.SCHEDULED))
            .thenReturn(Optional.of(publicScheduledCompetition));
        when(userService.findById(participantId, organizationId)).thenReturn(userToAccept);
        when(competitionInvitationRepository
            .findByCompetitionAndParticipantAndStatus(competitionId, participantId, CompetitionInvitationStatus.PENDING))
            .thenReturn(Optional.empty());

        //then
        assertThrows(EntityNotFoundException.class,
            () -> competitionService.acceptInvitation(organizationId, competitionId, participantId, ApiConstants.SOURCE_PARTICIPANT));
    }

    @Test
    void expectIllegalArgumentExceptionWhenInvitationAcceptedByInvitationCreator() {
        //given
        Long organizationId = 1L;
        Long competitionId = 15L;
        Long participantId = 2L;

        var publicScheduledCompetition = createCompetitionEntity(organizationId, competitionId);
        publicScheduledCompetition.setIsPrivate(false);
        var userToAccept = createUser(participantId);
        var participantUserEntity = competitionMapper.userToUserEntity(userToAccept);
        var pendingCompetitionInvitation = createCompetitionInvitationEntity(publicScheduledCompetition, participantUserEntity);
        pendingCompetitionInvitation.setStatus(CompetitionInvitationStatus.PENDING);
        pendingCompetitionInvitation.setSource(ApiConstants.SOURCE_TRAINER);

        //when
        when(competitionRepository
            .findByIdAndOrganizationIdAndStatus(competitionId, organizationId, CompetitionStatus.SCHEDULED))
            .thenReturn(Optional.of(publicScheduledCompetition));
        when(userService.findById(participantId, organizationId)).thenReturn(userToAccept);
        when(competitionInvitationRepository
            .findByCompetitionAndParticipantAndStatus(competitionId, participantId, CompetitionInvitationStatus.PENDING))
            .thenReturn(Optional.of(pendingCompetitionInvitation));

        //then
        assertThrows(IllegalArgumentException.class,
            () -> competitionService.acceptInvitation(organizationId, competitionId, participantId, ApiConstants.SOURCE_TRAINER));
    }

    @Test
    void expectDeclinesCompetitionInvitation() {
        //given
        Long organizationId = 1L;
        Long competitionId = 15L;
        Long participantId = 2L;

        var publicScheduledCompetition = createCompetitionEntity(organizationId, competitionId);
        publicScheduledCompetition.setIsPrivate(false);
        var userToAccept = createUser(participantId);
        var participantUserEntity = competitionMapper.userToUserEntity(userToAccept);
        var pendingCompetitionInvitation = createCompetitionInvitationEntity(publicScheduledCompetition, participantUserEntity);
        pendingCompetitionInvitation.setStatus(CompetitionInvitationStatus.PENDING);

        //when
        when(userService.findById(participantId, organizationId)).thenReturn(userToAccept);
        when(competitionInvitationRepository
            .findByCompetitionAndParticipantAndStatus(competitionId, participantId, CompetitionInvitationStatus.PENDING))
            .thenReturn(Optional.of(pendingCompetitionInvitation));
        when(competitionInvitationRepository.save(any())).then(returnsFirstArg());

        //then
        var declinedInvitation = competitionService.declineInvitation(competitionId, participantId);
        assertEquals(CompetitionInvitationStatus.DECLINED, declinedInvitation.getStatus());
        assertEquals(competitionId, declinedInvitation.getCompetitionId());
        assertEquals(participantId, declinedInvitation.getParticipant().getId());
    }

    @Test
    void expectEntityNotFoundExceptionWhenUnableToFindPendingCompetitionInvitationToDecline() {
        //given
        Long organizationId = 1L;
        Long competitionId = 15L;
        Long participantId = 2L;

        var publicScheduledCompetition = createCompetitionEntity(organizationId, competitionId);
        publicScheduledCompetition.setIsPrivate(false);
        var userToAccept = createUser(participantId);

        //when
        when(userService.findById(participantId, organizationId)).thenReturn(userToAccept);
        when(competitionInvitationRepository
            .findByCompetitionAndParticipantAndStatus(competitionId, participantId, CompetitionInvitationStatus.PENDING))
            .thenReturn(Optional.empty());

        //then
        assertThrows(EntityNotFoundException.class,
            () -> competitionService.declineInvitation(competitionId, participantId));
    }

    @Test
    void expectPermanentlyDeclinesPendingCompetitionInvitation() {
        //given
        Long organizationId = 1L;
        Long competitionId = 15L;
        Long participantId = 2L;

        var publicScheduledCompetition = createCompetitionEntity(organizationId, competitionId);
        publicScheduledCompetition.setIsPrivate(false);
        var userToPermanentDecline = createUser(participantId);
        var participantUserEntity = competitionMapper.userToUserEntity(userToPermanentDecline);
        var pendingCompetitionInvitation = createCompetitionInvitationEntity(publicScheduledCompetition, participantUserEntity);
        pendingCompetitionInvitation.setStatus(CompetitionInvitationStatus.PENDING);

        //when
        when(competitionRepository
            .findByIdAndOrganizationIdAndStatus(competitionId, organizationId, CompetitionStatus.SCHEDULED))
            .thenReturn(Optional.of(publicScheduledCompetition));
        when(userService.findById(participantId, organizationId)).thenReturn(userToPermanentDecline);
        when(competitionInvitationRepository.findByCompetitionIdAndParticipantId(competitionId, participantId))
            .thenReturn(Optional.of(pendingCompetitionInvitation));
        when(competitionInvitationRepository.save(any())).then(returnsFirstArg());

        //then
        competitionService.declineInvitationPermanently(organizationId, competitionId, participantId);
        ArgumentCaptor<CompetitionInvitationEntity> invitationCaptor = ArgumentCaptor.forClass(CompetitionInvitationEntity.class);
        verify(competitionInvitationRepository).save(invitationCaptor.capture());

        CompetitionInvitationEntity permanentlyDeclinedInvitation = invitationCaptor.getValue();
        assertEquals(CompetitionInvitationStatus.PERMANENTLY_DECLINED, permanentlyDeclinedInvitation.getStatus());
        assertEquals(competitionId, permanentlyDeclinedInvitation.getCompetition().getId());
        assertEquals(participantId, permanentlyDeclinedInvitation.getParticipant().getId());
    }

    @Test
    void expectPermanentDeclinesDeclinedCompetitionInvitation() {
        //given
        Long organizationId = 1L;
        Long competitionId = 15L;
        Long participantId = 2L;

        var publicScheduledCompetition = createCompetitionEntity(organizationId, competitionId);
        publicScheduledCompetition.setIsPrivate(false);
        var userToPermanentDecline = createUser(participantId);
        var participantUserEntity = competitionMapper.userToUserEntity(userToPermanentDecline);
        var pendingCompetitionInvitation = createCompetitionInvitationEntity(publicScheduledCompetition, participantUserEntity);
        pendingCompetitionInvitation.setStatus(CompetitionInvitationStatus.DECLINED);

        //when
        when(competitionRepository
            .findByIdAndOrganizationIdAndStatus(competitionId, organizationId, CompetitionStatus.SCHEDULED))
            .thenReturn(Optional.of(publicScheduledCompetition));
        when(userService.findById(participantId, organizationId)).thenReturn(userToPermanentDecline);
        when(competitionInvitationRepository.findByCompetitionIdAndParticipantId(competitionId, participantId))
            .thenReturn(Optional.of(pendingCompetitionInvitation));
        when(competitionInvitationRepository.save(any())).then(returnsFirstArg());

        //then
        competitionService.declineInvitationPermanently(organizationId, competitionId, participantId);
        ArgumentCaptor<CompetitionInvitationEntity> invitationCaptor = ArgumentCaptor.forClass(CompetitionInvitationEntity.class);
        verify(competitionInvitationRepository).save(invitationCaptor.capture());

        CompetitionInvitationEntity permanentlyDeclinedInvitation = invitationCaptor.getValue();
        assertEquals(CompetitionInvitationStatus.PERMANENTLY_DECLINED, permanentlyDeclinedInvitation.getStatus());
        assertEquals(competitionId, permanentlyDeclinedInvitation.getCompetition().getId());
        assertEquals(participantId, permanentlyDeclinedInvitation.getParticipant().getId());
    }

    @Test
    void expectCreatesPermanentlyDeclinedInvitationWhenUserNotInvitedYet() {
        //given
        Long organizationId = 1L;
        Long competitionId = 15L;
        Long participantId = 2L;

        var publicScheduledCompetition = createCompetitionEntity(organizationId, competitionId);
        publicScheduledCompetition.setIsPrivate(false);
        var userToPermanentDecline = createUser(participantId);
        var participantUserEntity = competitionMapper.userToUserEntity(userToPermanentDecline);
        var pendingCompetitionInvitation = createCompetitionInvitationEntity(publicScheduledCompetition, participantUserEntity);
        pendingCompetitionInvitation.setStatus(CompetitionInvitationStatus.DECLINED);

        //when
        when(competitionRepository
            .findByIdAndOrganizationIdAndStatus(competitionId, organizationId, CompetitionStatus.SCHEDULED))
            .thenReturn(Optional.of(publicScheduledCompetition));
        when(userService.findById(participantId, organizationId)).thenReturn(userToPermanentDecline);
        when(competitionInvitationRepository.findByCompetitionIdAndParticipantId(competitionId, participantId))
            .thenReturn(Optional.empty());
        when(competitionInvitationRepository.save(any())).then(returnsFirstArg());

        //then
        competitionService.declineInvitationPermanently(organizationId, competitionId, participantId);
        ArgumentCaptor<CompetitionInvitationEntity> invitationCaptor = ArgumentCaptor.forClass(CompetitionInvitationEntity.class);
        verify(competitionInvitationRepository).save(invitationCaptor.capture());

        CompetitionInvitationEntity permanentlyDeclinedInvitation = invitationCaptor.getValue();
        assertEquals(CompetitionInvitationStatus.PERMANENTLY_DECLINED, permanentlyDeclinedInvitation.getStatus());
        assertEquals(competitionId, permanentlyDeclinedInvitation.getCompetition().getId());
        assertEquals(participantId, permanentlyDeclinedInvitation.getParticipant().getId());
    }

    private CompetitionInvitationEntity createCompetitionInvitationEntity(CompetitionEntity competitionEntity,
                                                                          UserEntity participant) {
        var competitionInvitation = new CompetitionInvitationEntity();
        competitionInvitation.setCompetition(competitionEntity);
        competitionInvitation.setParticipant(participant);
        return competitionInvitation;
    }

    private CompetitionEntity createCompetitionEntity(Long organizationId, Long competitionId) {
        Competition competition = CompetitionTestUtils.getCompetition();

        CompetitionEntity competitionEntity = new CompetitionEntity();
        competitionEntity.setId(competitionId);
        competitionEntity.setOrganizationId(organizationId);
        competitionEntity.setName(competition.getName());
        competitionEntity.setNotes(competition.getNotes());
        competitionEntity.setParticipants(Set.of());
        competitionEntity.setStartPoint(competition.getStartPoint());
        competitionEntity.setFinishPoint(competition.getFinishPoint());
        competitionEntity.setFoxAmount(competition.getFoxAmount());
        return competitionEntity;
    }

    private ModifyCompetition getModifyCompetitionDto() {
        Competition competition = CompetitionTestUtils.getCompetition();
        return modifyCompetitionMapper.convertToDomain(competition);
    }

    private User createUser(Long userId) {
        User user = new User();
        user.setId(userId);
        user.setEmail("foxhunt.email@gmail.com");
        return user;
    }

    private UserEntity getUser() {
        UserEntity user = new UserEntity();
        user.setId(1L);
        user.setEmail("foxhunt.email@gmail.com");
        return user;
    }

}
