package com.itechart.foxhunt.api.competition.service;

import com.itechart.foxhunt.api.auth.security.LoggedUserService;
import com.itechart.foxhunt.api.competition.CompetitionInvitationStatus;
import com.itechart.foxhunt.api.competition.dto.CancelCompetitionRequest;
import com.itechart.foxhunt.api.competition.dto.Competition;
import com.itechart.foxhunt.api.competition.dto.CompetitionInvitation;
import com.itechart.foxhunt.api.competition.dto.GetAllCompetitionsRequest;
import com.itechart.foxhunt.api.competition.dto.ModifyCompetition;
import com.itechart.foxhunt.api.competition.dto.PersonalUserResult;
import com.itechart.foxhunt.api.competition.entity.CompetitionInvitationEntity;
import com.itechart.foxhunt.api.competition.mapper.CompetitionInvitationMapper;
import com.itechart.foxhunt.api.competition.mapper.CompetitionMapper;
import com.itechart.foxhunt.api.competition.mapper.ModifyCompetitionMapper;
import com.itechart.foxhunt.api.competition.projection.ProjectionResolver;
import com.itechart.foxhunt.api.competition.repository.CompetitionInvitationRepository;
import com.itechart.foxhunt.api.competition.repository.CompetitionParticipantRepository;
import com.itechart.foxhunt.api.competition.repository.CompetitionRepository;
import com.itechart.foxhunt.api.core.ApiConstants;
import com.itechart.foxhunt.api.user.dao.UserRepository;
import com.itechart.foxhunt.api.user.dto.User;
import com.itechart.foxhunt.api.user.service.UserService;
import com.itechart.foxhunt.domain.entity.CompetitionEntity;
import com.itechart.foxhunt.domain.entity.CompetitionParticipantEntity;
import com.itechart.foxhunt.domain.entity.CompetitionParticipantId;
import com.itechart.foxhunt.domain.entity.UserEntity;
import com.itechart.foxhunt.domain.enums.CompetitionStatus;
import com.itechart.foxhunt.domain.enums.Role;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import static com.itechart.foxhunt.api.competition.CompetitionInvitationStatus.ACCEPTED;
import static com.itechart.foxhunt.api.competition.CompetitionInvitationStatus.DECLINED;
import static com.itechart.foxhunt.api.competition.CompetitionInvitationStatus.PENDING;
import static com.itechart.foxhunt.api.competition.CompetitionInvitationStatus.PERMANENTLY_DECLINED;

@Service
@Slf4j
@RequiredArgsConstructor
public class CompetitionServiceImpl implements CompetitionService {

    private final CompetitionRepository competitionRepository;

    private final CompetitionValidationService competitionValidationService;

    private final CompetitionMapper competitionMapper;

    private final ModifyCompetitionMapper modifyCompetitionMapper;

    private final UserService userService;

    private final UserRepository userRepository;

    private final ProjectionResolver projectionResolver;

    private final CompetitionInvitationRepository competitionInvitationRepository;

    private final CompetitionParticipantRepository competitionParticipantRepository;

    private final LoggedUserService loggedUserService;

    private final CompetitionInvitationMapper competitionInvitationMapper;

    @Override
    public Page<? extends Competition> findAllAvailable(GetAllCompetitionsRequest competitionsRequest,
                                                        Pageable pageable,
                                                        Long organizationId, User loggedUser) {
        Long userId = loggedUser.getId();
        boolean isParticipant = hasRole(loggedUser, List.of(Role.PARTICIPANT));
        Page<? extends Competition> competitionProjectionsPage =
            projectionResolver.getCompetitionProjectionsList(userId, competitionsRequest, pageable, organizationId);

        if (isParticipant) {
            Set<Long> permanentlyDeclinedInvitationsIds = competitionInvitationRepository
                .findAllByParticipantIdAndStatus(userId, PERMANENTLY_DECLINED).stream()
                .map(invitation -> invitation.getCompetition().getId())
                .collect(Collectors.toSet());

            var participantCompetitions = competitionProjectionsPage
                .stream().filter(competition -> !permanentlyDeclinedInvitationsIds.contains(competition.getId()))
                .toList();
            competitionProjectionsPage = new PageImpl<>(participantCompetitions, pageable, participantCompetitions.size());
        }

        return competitionProjectionsPage;
    }

    @Override
    public Competition getCompetitionById(final Long id, final Long organizationId) {
        log.debug(competitionMapper.entityToDomain(findById(id, organizationId)) + " inside getCompetitionById");
        return competitionMapper.entityToDomain(findById(id, organizationId));
    }

    @Override
    public Page<PersonalUserResult> getUserResults(Long userId, Long organizationId, Pageable pageable) {
        Page<CompetitionParticipantEntity> competitionParticipantEntityPage = competitionParticipantRepository
            .getAllByUserIdAndOrganizationId(pageable, userId, organizationId);

        List<PersonalUserResult> personalUserResultList = competitionParticipantEntityPage
            .stream()
            .map(this::competitionParticipantToUserResult)
            .collect(Collectors.toList());

        return new PageImpl<>(personalUserResultList, pageable, competitionParticipantEntityPage.getTotalElements());
    }

    @Override
    @SneakyThrows
    public CompetitionEntity findById(final Long id, final Long organizationId) {
        return competitionRepository.findByIdAndOrganizationId(id, organizationId)
            .orElseThrow(() -> {
                final String msg = String.format("Invalid #: %s", id.toString());
                throw new EntityNotFoundException(msg);
            });
    }

    @Override
    public Competition updateById(final ModifyCompetition updatedCompetition, final Long id,
                                  final Long organizationId) {
                                    log.debug(updatedCompetition + " updatedCompetition in updateById");
        CompetitionEntity competition = findById(id, organizationId);
        log.debug(competition + " competition in updateById");
        Optional.ofNullable(updatedCompetition.getNotes()).ifPresent(competition::setNotes);
        Optional.ofNullable(updatedCompetition.getCoachId()).ifPresent(coachId -> {
            if (!competition.getCoach().getId().equals(coachId)) {
                Optional<UserEntity> coach = userRepository.findById(coachId);
                coach.ifPresent(competition::setCoach);
            }
        });
        Optional.ofNullable(updatedCompetition.getFoxAmount()).ifPresent(competition::setFoxAmount);
        Optional.ofNullable(updatedCompetition.getDistanceType()).ifPresent(competition::setDistanceType);
        Optional.ofNullable(updatedCompetition.getIsPrivate()).ifPresent(competition::setIsPrivate);
        Optional.ofNullable(updatedCompetition.getStartPoint()).ifPresent(competition::setStartPoint);
        Optional.ofNullable(updatedCompetition.getFinishPoint()).ifPresent(competition::setFinishPoint);
        Optional.ofNullable(updatedCompetition.getFoxDuration()).ifPresent(competition::setFoxDuration);
        Optional.ofNullable(updatedCompetition.getFoxRange()).ifPresent(competition::setFoxRange);
        Optional.ofNullable(updatedCompetition.getFrequency()).ifPresent(frequency -> competition.setFrequency(BigDecimal.valueOf(frequency)));
        Optional.of(updatedCompetition.isHasSilenceInterval()).ifPresent(competition::setHasSilenceInterval);
        competition.setUpdatedDate(LocalDateTime.now());
        log.debug(competition + " competition_after in updateById");
        return competitionMapper.entityToDomain(competitionRepository.save(competition));
    }

    @Override
    public Competition cancelById(CancelCompetitionRequest cancelRequest, Long id, Long organizationId) {
        final CompetitionEntity competitionEntity = findById(id, organizationId);
        competitionValidationService.validateCancelCompetition(competitionEntity);

        competitionEntity.setStatus(CompetitionStatus.CANCELED);
        competitionEntity.setCancellationReason(cancelRequest.getReason());
        CompetitionEntity canceledCompetition = competitionRepository.save(competitionEntity);

        return competitionMapper.entityToDomain(canceledCompetition);
    }

    @Override
    public Competition create(final ModifyCompetition competition, final Long organizationId) {
        competitionValidationService.validateCreateCompetition(organizationId, competition);

        UserEntity loggedUserEntity = loggedUserService.getLoggedUserEntity();

        final CompetitionEntity entityToSave = modifyCompetitionMapper.domainToEntity(competition);
        entityToSave.setOrganizationId(organizationId);
        entityToSave.setCoach(userRepository.getById(competition.getCoachId()));
        entityToSave.setStatus(CompetitionStatus.SCHEDULED);

        if (Objects.isNull(entityToSave.getCreatedBy()) || Objects.isNull(entityToSave.getCreatedBy().getEmail())) {
            entityToSave.setCreatedBy(loggedUserEntity);
        }
        CompetitionEntity savedCompetition = competitionRepository
            .save(Objects.requireNonNull(entityToSave));
        return competitionMapper.entityToDomain(savedCompetition);
    }

    @Override
    @Transactional
    public CompetitionInvitation subscribe(Long organizationId, Long competitionId,
                                           Long participantId, String invitationCreatorRole) {
        CompetitionEntity competition = findScheduledCompetition(competitionId, organizationId);
        User userToMakeParticipant = userService.findById(participantId, organizationId);
        UserEntity participantUserEntity = competitionMapper.userToUserEntity(userToMakeParticipant);

        return switch (invitationCreatorRole) {
            case ApiConstants.SOURCE_PARTICIPANT ->
                createInvitationFromParticipant(participantUserEntity, competition, invitationCreatorRole);
            case ApiConstants.SOURCE_TRAINER ->
                createInvitationFromTrainer(participantUserEntity, competition, invitationCreatorRole);
            default -> throw new IllegalArgumentException(
                String.format("Unsupported invitation creator role: %s", invitationCreatorRole));
        };
    }

    private CompetitionInvitation createInvitationFromParticipant(UserEntity participantUserEntity,
                                                                  CompetitionEntity competition,
                                                                  String invitationCreatorRole) {
        if (competition.getIsPrivate()) {
            throw new IllegalArgumentException("Participant can't subscribe to private competition");
        }
        return createInvitation(participantUserEntity, competition, invitationCreatorRole);
    }

    private CompetitionInvitation createInvitationFromTrainer(UserEntity participantUserEntity,
                                                              CompetitionEntity competition,
                                                              String invitationCreatorRole) {
        if (competition.getCoach().getId().equals(participantUserEntity.getId())) {
            throw new IllegalArgumentException("Competition Coach can't subscribe to competition as participant");
        }
        return createInvitation(participantUserEntity, competition, invitationCreatorRole);
    }

    private CompetitionInvitation createInvitation(UserEntity participant, CompetitionEntity competitionEntity,
                                                   String invitationCreatorRole) {
        log.info("Creating competition invitation by {} for user with id: {}", invitationCreatorRole, participant.getId());
        Optional<CompetitionInvitationEntity> existingInvitationEntity = competitionInvitationRepository
            .findByCompetitionIdAndParticipantId(competitionEntity.getId(), participant.getId());

        CompetitionInvitationEntity createdInvitation = existingInvitationEntity.isPresent() ?
            processAlreadyExistingInvitation(existingInvitationEntity.get(), invitationCreatorRole) :
            createNewInvitation(competitionEntity, participant, invitationCreatorRole, PENDING);
        return competitionInvitationMapper.entityToDomain(createdInvitation);
    }

    private CompetitionInvitationEntity processAlreadyExistingInvitation(CompetitionInvitationEntity competitionInvitation,
                                                                         String invitationCreatorRole) {
        Long competitionId = competitionInvitation.getCompetition().getId();
        Long participantId = competitionInvitation.getParticipant().getId();

        return switch (competitionInvitation.getStatus()) {
            case DECLINED -> {
                log.info("Updating status from {} to {} in competition invitation for user: {} in competition: {}",
                    DECLINED, PENDING, participantId, competitionId);
                competitionInvitation.setSource(invitationCreatorRole);
                yield saveProcessedInvitation(competitionInvitation, PENDING);
            }
            case PENDING -> throw new IllegalArgumentException(
                String.format("Invitation for user with id: %s in competition: %s already exists",
                    participantId, competitionId));
            case PERMANENTLY_DECLINED -> throw new IllegalArgumentException(
                String.format("User: %s was permanently declined in competition: %s",
                    participantId, competitionId));
            default ->
                throw new IllegalArgumentException(String.format("Status: %s is not supported in create invitation",
                    competitionInvitation.getStatus()));
        };
    }

    @Override
    @Transactional
    public CompetitionInvitation acceptInvitation(Long organizationId, Long competitionId, Long acceptedUserId,
                                                  String invitationAccepterRole) {
        var invitationToAccept = findPendingCompetitionInvitation(competitionId, acceptedUserId);
        checkAcceptedNotByCreator(invitationToAccept, invitationAccepterRole);
        var acceptedInvitation = saveProcessedInvitation(invitationToAccept, ACCEPTED);

        addParticipantToCompetition(organizationId, competitionId, acceptedUserId);
        return competitionInvitationMapper.entityToDomain(acceptedInvitation);
    }

    private void checkAcceptedNotByCreator(CompetitionInvitationEntity invitation, String invitationCreatorRole) {
        if (invitation.getSource().equals(invitationCreatorRole)) {
            throw new IllegalArgumentException("Competition invitation can't be created and approved by the same user");
        }
    }

    private void addParticipantToCompetition(Long organizationId, Long competitionId, Long participantId) {
        CompetitionEntity scheduledCompetition = findScheduledCompetition(competitionId, organizationId);
        User userToMakeParticipant = userService.findById(participantId, organizationId);
        UserEntity participantUserEntity = competitionMapper.userToUserEntity(userToMakeParticipant);

        log.info("Adding user with id: {} to competition with id: {}", participantId, competitionId);
        var participantToAdd = buildCompetitionParticipant(scheduledCompetition, participantUserEntity);
        competitionParticipantRepository.save(participantToAdd);
    }

    private CompetitionParticipantEntity buildCompetitionParticipant(
        CompetitionEntity competitionEntity, UserEntity participant) {
        return CompetitionParticipantEntity.builder()
            .id(new CompetitionParticipantId())
            .competition(competitionEntity)
            .user(participant)
            .build();
    }

    @Override
    public CompetitionInvitation declineInvitation(Long competitionId, Long declinedUserId) {
        var invitationToDecline = findPendingCompetitionInvitation(competitionId, declinedUserId);
        var declinedInvitation = saveProcessedInvitation(invitationToDecline, DECLINED);
        return competitionInvitationMapper.entityToDomain(declinedInvitation);
    }

    @Override
    public CompetitionInvitation declineInvitationPermanently(Long organizationId, Long competitionId, Long participantId) {
        CompetitionInvitationEntity permanentlyDeclinedInvitation = competitionInvitationRepository
            .findByCompetitionIdAndParticipantId(competitionId, participantId)
            .map(this::declineExistingInvitationPermanently)
            .orElseGet(() -> createPermanentlyDeclinedInvitation(organizationId, competitionId, participantId));
        return competitionInvitationMapper.entityToDomain(permanentlyDeclinedInvitation);
    }

    private CompetitionInvitationEntity declineExistingInvitationPermanently(CompetitionInvitationEntity invitation) {
        if (ACCEPTED.equals(invitation.getStatus())) {
            throw new IllegalArgumentException("Can't permanently decline accepted invitation");
        }
        return saveProcessedInvitation(invitation, PERMANENTLY_DECLINED);
    }

    private CompetitionInvitationEntity createPermanentlyDeclinedInvitation(Long organizationId, Long competitionId, Long participantId) {
        CompetitionEntity competition = findScheduledCompetition(competitionId, organizationId);
        User userToMakeParticipant = userService.findById(participantId, organizationId);
        UserEntity participantUserEntity = competitionMapper.userToUserEntity(userToMakeParticipant);
        return createNewInvitation(competition, participantUserEntity, ApiConstants.SOURCE_TRAINER, PERMANENTLY_DECLINED);
    }

    private CompetitionInvitationEntity createNewInvitation(CompetitionEntity competitionEntity, UserEntity participant,
                                                            String invitationCreatorRole, CompetitionInvitationStatus status) {
        log.info("Creating new invitation for user: {} in competition: {}", participant.getId(), competitionEntity.getId());
        CompetitionInvitationEntity invitation = buildCompetitionInvitation(competitionEntity,
            participant, invitationCreatorRole, status);
        return competitionInvitationRepository.save(invitation);
    }

    private CompetitionInvitationEntity buildCompetitionInvitation(CompetitionEntity competition,
                                                                   UserEntity participant, String source,
                                                                   CompetitionInvitationStatus status) {
        CompetitionInvitationEntity invitation = new CompetitionInvitationEntity();
        invitation.setCreatedAt(LocalDateTime.now());
        invitation.setCompetition(competition);
        invitation.setParticipant(participant);
        invitation.setSource(source);
        invitation.setStatus(status);
        return invitation;
    }

    private CompetitionInvitationEntity findPendingCompetitionInvitation(Long competitionId, Long participantId) {
        return competitionInvitationRepository
            .findByCompetitionAndParticipantAndStatus(competitionId, participantId, PENDING)
            .orElseThrow(() -> {
                throw new EntityNotFoundException(String
                    .format(
                        "PENDING invitation to competition with id: %s of user with id: %s not found",
                        competitionId, participantId));
            });
    }

    private CompetitionInvitationEntity saveProcessedInvitation(CompetitionInvitationEntity invitationToSave,
                                                                CompetitionInvitationStatus status) {
        log.debug("Updating invitation with id: {} with status {}", invitationToSave.getId(), status);
        invitationToSave.setUpdatedAt(LocalDateTime.now());
        invitationToSave.setStatus(status);
        return competitionInvitationRepository.save(invitationToSave);
    }

    @Override
    public boolean existsByIdAndWithinOrganizationWithId(Long id, Long organizationId) {
        return competitionRepository.existsByIdAndOrganizationId(id, organizationId);
    }

    @Override
    public List<CompetitionInvitation> getAllInvitationsByCompetitionId(Long organizationId, Long competitionId,
                                                                        User loggedUser) {
        Long loggedUserId = loggedUser.getId();
        boolean haveAccessToAllInvitations = hasRole(loggedUser, List.of(Role.TRAINER, Role.ORGANIZATION_ADMIN));

        List<CompetitionInvitationEntity> competitionInvitations = haveAccessToAllInvitations ?
            competitionInvitationRepository.findAllByCompetitionIdAndOrganizationId(competitionId, organizationId) :
            competitionInvitationRepository.findAllByCompetitionIdAndUserIdAndOrganizationId(competitionId, organizationId, loggedUserId);

        return competitionInvitations.stream()
            .map(competitionInvitationMapper::entityToDomain)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteById(final Long id) {
        competitionRepository.deleteById(id);
    }

    @Override
    @Transactional
    public void removeParticipantFromCompetition(Long competitionId, Long userId) {
        log.info("Deleting invitation for user with id: {} in competition with id: {}", userId, competitionId);
        competitionInvitationRepository.deleteByCompetitionIdAndParticipantId(competitionId, userId);
        log.info("Deleting participant with id: {} from competition with id: {}", userId, competitionId);
        competitionParticipantRepository.deleteByCompetitionIdAndUserId(competitionId, userId);
    }

    private CompetitionEntity findScheduledCompetition(Long competitionId, Long organizationId) {
        return competitionRepository
            .findByIdAndOrganizationIdAndStatus(competitionId,
                organizationId, CompetitionStatus.SCHEDULED)
            .orElseThrow(() -> {
                throw new EntityNotFoundException(
                    String.format("Scheduled competition with id: %s not found", competitionId));
            });
    }

    private PersonalUserResult competitionParticipantToUserResult(CompetitionParticipantEntity competitionParticipantEntity) {
        return PersonalUserResult
            .builder()
            .competition(competitionMapper.entityToDomain(competitionParticipantEntity.getCompetition()))
            .foundedFoxes(competitionParticipantEntity.getCompetitionResult().size())
            .startDate(competitionParticipantEntity.getStartDate())
            .finishDate(competitionParticipantEntity.getFinishDate())
            .build();
    }

    private boolean hasRole(User user, List<Role> rolesToCheck) {
        return user.getRoles().stream()
            .map(role -> role.getRole())
            .anyMatch(rolesToCheck::contains);
    }

}
