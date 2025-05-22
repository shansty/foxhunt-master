package com.itechart.foxhunt.api.user.service;

import com.itechart.foxhunt.api.exception.BadRequestException;
import com.itechart.foxhunt.api.organization.Organization;
import com.itechart.foxhunt.api.organization.OrganizationService;
import com.itechart.foxhunt.api.user.dao.UserInvitationRepository;
import com.itechart.foxhunt.api.user.dto.InvitationDeclineReason;
import com.itechart.foxhunt.api.user.dto.InviteUsersRequest;
import com.itechart.foxhunt.api.user.dto.OrganizationUserRoleShortDto;
import com.itechart.foxhunt.api.user.dto.User;
import com.itechart.foxhunt.api.user.dto.UserInvitation;
import com.itechart.foxhunt.api.user.email.invitation.InvitationProcessingServiceImpl;
import com.itechart.foxhunt.api.user.mapper.UserInvitationMapper;
import com.itechart.foxhunt.api.user.service.validator.UserValidator;
import com.itechart.foxhunt.domain.entity.UserInvitationEntity;
import com.itechart.foxhunt.domain.enums.OrganizationStatus;
import com.itechart.foxhunt.domain.enums.Role;
import com.itechart.foxhunt.domain.enums.UserInvitationStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import static com.itechart.foxhunt.domain.enums.UserInvitationStatus.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserInvitationServiceImpl implements UserInvitationService {

    private final UserInvitationMapper userInvitationMapper;

    private final UserInvitationRepository userInvitationRepository;

    private final UserService userService;

    private final OrganizationService organizationService;

    private final InvitationProcessingServiceImpl invitationProcessingService;

    private final OrganizationUserRoleService organizationUserRoleService;

    private final UserValidator userValidator;

    public List<UserInvitation> getAll(Pageable pageable) {
        log.info("Received request to get all user invitations, page {}/{}",
            pageable.getPageNumber(), pageable.getPageSize());
        List<UserInvitation> fetchedInvitations = userInvitationRepository.findAll(pageable)
            .map(entity -> {
                UserInvitation invitation = userInvitationMapper.entityToDomain(entity);
                if (entity.getStatus().equals(NEW) && isInvitationExpired(entity)) {
                    invitation.setStatus(EXPIRED);
                }
                return invitation;
            }).getContent();
        log.info("Found {} user invitations", fetchedInvitations.size());
        return fetchedInvitations.isEmpty() ? fetchedInvitations : buildUserInvitations(fetchedInvitations);
    }

    private List<UserInvitation> buildUserInvitations(List<UserInvitation> userInvitations) {
        log.info("Building user invitations...");
        List<Long> orgIds = userInvitations.stream()
            .map(invitation -> invitation.getOrganization().getId())
            .distinct()
            .collect(Collectors.toList());
        Map<Long, Organization> organizationsByIds = organizationService.getAll(orgIds).stream()
            .collect(Collectors.toMap(Organization::getId, organization -> organization));

        return userInvitations.stream()
            .peek(invitation -> {
                Organization organizationToSet = organizationsByIds.get(invitation.getOrganization().getId());
                invitation.setOrganization(organizationToSet);
            })
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UserInvitation processUserResponseOnInvitation(String orgDomain, String token, UserInvitationStatus status) {
        log.info("Received request to process response on invitation with TOKEN: {}", token);
        Organization organization = organizationService.findOrganizationByDomain(orgDomain);

        List<UserInvitationStatus> validInitialProcessingStatuses = List.of(NEW, EXPIRED);
        UserInvitationEntity invitationEntity = userInvitationRepository
            .findByTokenAndStatusInAndOrganizationId(token, validInitialProcessingStatuses, organization.getId())
            .orElseThrow(() -> {
                log.error("No user invitation in DB with token: {}", token);
                throw new EntityNotFoundException(
                    String.format("Unable to find invitation. Please contact administrator of the organization %s", orgDomain));
            });

        return isInvitationExpired(invitationEntity) ? processExpiredInvitation(organization, invitationEntity) :
            processValidInvitation(organization, invitationEntity, status);
    }

    private boolean isInvitationExpired(UserInvitationEntity invitation) {
        return invitation.getStatus().equals(EXPIRED) ||
            invitation.getEndDate().isBefore(LocalDateTime.now());
    }

    private UserInvitation processExpiredInvitation(Organization organization, UserInvitationEntity invitationToProcess) {
        log.info("Processing expired invitation with TOKEN {}", invitationToProcess.getToken());
        invitationToProcess.setStatus(EXPIRED);
        return saveInvitationProcessingResult(organization, invitationToProcess);
    }

    private UserInvitation processValidInvitation(Organization organization, UserInvitationEntity invitationToProcess,
                                                  UserInvitationStatus invitationStatus) {
        log.info("Processing valid invitation with TOKEN {} and STATUS {}", invitationToProcess.getToken(), invitationStatus);
        invitationToProcess.setStatus(invitationStatus);
        invitationToProcess.setTransitionDate(LocalDateTime.now());
        return switch (invitationStatus) {
            case ACCEPTED -> {
                Long userId = invitationToProcess.getUserEntity().getId();
                organizationUserRoleService.updateActiveStatus(organization.getId(), userId, true);
                yield saveInvitationProcessingResult(organization, invitationToProcess);
            }
            case DECLINED -> {
                UserInvitation processingResult = saveInvitationProcessingResult(organization, invitationToProcess);
                log.info("User invitation with TOKEN {} relates to organization {} with status NEW - declining organization status...",
                    processingResult.getToken(), organization.getId());
                organizationService.updateInitialStatus(organization.getId(), processingResult.getUser(), OrganizationStatus.DECLINED);
                yield processingResult;
            }
            default ->
                throw new BadRequestException(String.format("Status %s is unsupported for processing", invitationStatus));
        };
    }

    private UserInvitation saveInvitationProcessingResult(Organization organization, UserInvitationEntity invitationEntity) {
        UserInvitationEntity savedInvitation = userInvitationRepository.save(invitationEntity);
        UserInvitation processingResult = userInvitationMapper.entityToDomain(savedInvitation, organization);
        User userWithUserRoles = userService.findById(invitationEntity.getUserEntity().getId(), organization.getId());
        processingResult.setUser(userWithUserRoles);
        return processingResult;
    }

    @Override
    public List<UserInvitation> inviteUsers(Long organizationId, InviteUsersRequest inviteUsersRequest) {
        if (inviteUsersRequest.getOrganization() == null) {
            Organization invitationOrganization = organizationService.findOrganizationById(organizationId);
            inviteUsersRequest.setOrganization(invitationOrganization);
        }
        return invitationProcessingService.process(inviteUsersRequest);
    }

    @Override
    @Transactional
    public void inviteDeactivatedUser(User initiatedUser, Long reactivatedUserId, Long organizationId, Set<Role> roles) {
        User reactivatedUser = userService.findById(reactivatedUserId, organizationId);
        Set<OrganizationUserRoleShortDto> affectedRoles = takeAllAffectedRoles(organizationId, reactivatedUserId, roles);
        reactivatedUser.setRoles(affectedRoles);

        log.warn(String.format("Validation accessibility to invite deactivated user with id=%s and email=%s.",
            reactivatedUser.getId(), reactivatedUser.getEmail()));
        userValidator.validateUpdatingActiveStatus(initiatedUser, reactivatedUser);
        organizationUserRoleService.deleteAllRoles(organizationId, reactivatedUserId);

        Organization organization = organizationService.findOrganizationById(organizationId);
        Set<String> emails = Set.of(reactivatedUser.getEmail());
        invitationProcessingService.process(buildInviteRequest(organization, emails, roles));
    }

    private Set<OrganizationUserRoleShortDto> takeAllAffectedRoles(Long organizationId, Long reactivatedUserId, Set<Role> newRoles) {
        Set<Role> roles = organizationUserRoleService.findAllByOrganizationIdAndUserId(organizationId, reactivatedUserId).stream()
            .map(orgUserRole -> orgUserRole.getRoleEntity().getRole())
            .collect(Collectors.toSet());
        roles.addAll(newRoles);
        return roles.stream()
            .map(role -> new OrganizationUserRoleShortDto(organizationId, reactivatedUserId, role, Boolean.FALSE))
            .collect(Collectors.toSet());
    }

    @Override
    public UserInvitation resendInvitation(Long userInvitationId) {
        UserInvitationEntity invitationToResend = findById(userInvitationId);
        validateInvitationToResend(invitationToResend);

        Long organizationId = invitationToResend.getOrganizationId();
        Long userId = invitationToResend.getUserEntity().getId();
        String email = invitationToResend.getUserEntity().getEmail();

        Set<Role> roles = organizationUserRoleService.findAllByOrganizationIdAndUserId(organizationId, userId).stream()
            .map(orgUserRole -> orgUserRole.getRoleEntity().getRole())
            .collect(Collectors.toSet());

        log.info("Sending invitation with user email: {}, roles: {} and organization: {}", email, roles, organizationId);

        Organization invitationOrg = organizationService.findOrganizationById(organizationId);
        InviteUsersRequest inviteRequest = buildInviteRequest(invitationOrg, Set.of(email), roles);
        return inviteUsers(invitationOrg.getId(), inviteRequest).get(0);
    }

    private void validateInvitationToResend(UserInvitationEntity userInvitation) {
        List<UserInvitationStatus> allowedToResendStatuses = List.of(NEW,
            DECLINED, EXPIRED, FAILED);
        if (!allowedToResendStatuses.contains(userInvitation.getStatus())) {
            log.error("User invitation with ID {} has status {}, which is not allowed to resend",
                userInvitation.getUserInvitationId(), userInvitation.getStatus());
            throw new IllegalArgumentException(
                String.format("User invitation with status %s can't be resend", userInvitation.getStatus()));
        }
    }

    @Override
    public void declineInvitation(Long invitationId) {
        UserInvitationEntity invitationToDecline = findById(invitationId);
        validateInvitationToDecline(invitationToDecline);

        invitationToDecline.setStatus(DECLINED);
        userInvitationRepository.save(invitationToDecline);
    }

    private void validateInvitationToDecline(UserInvitationEntity userInvitation) {
        List<UserInvitationStatus> allowedToDeclineStatuses = List.of(NEW);
        if (!allowedToDeclineStatuses.contains(userInvitation.getStatus())) {
            log.error("User invitation with ID {} has status {}, which is not allowed to decline",
                userInvitation.getUserInvitationId(), userInvitation.getStatus());
            throw new IllegalArgumentException(
                String.format("User invitation with status %s can't be declined", userInvitation.getStatus()));
        }
    }

    @Override
    public InvitationDeclineReason setDeclineReason(String invitationToken, InvitationDeclineReason declineReason) {
        UserInvitationEntity declinedUserInvitation = userInvitationRepository.findByTokenAndStatus(invitationToken, DECLINED)
            .orElseThrow(() -> {
                log.error("No user invitation in DB with token: {}", invitationToken);
                throw new EntityNotFoundException(
                    String.format("No user invitation in DB with token = %s", invitationToken));
            });

        if (declinedUserInvitation.getDeclinationReason() != null) {
            log.error("Decline reason for user invitation with TOKEN {} already exists", invitationToken);
            throw new IllegalArgumentException(
                String.format("Decline reason for user invitation with TOKEN %s already exists", invitationToken));
        }

        declinedUserInvitation.setDeclinationReason(declineReason.getDeclinationReason());
        UserInvitationEntity savedUserInvitation = userInvitationRepository.save(declinedUserInvitation);
        log.info("Decline reason: {} - for user invitation with TOKEN {} has been set",
            declineReason.getDeclinationReason(), invitationToken);
        return userInvitationMapper.entityToDeclineReason(savedUserInvitation);
    }

    @Override
    public void checkInvitationExistence(Long organizationId, Long userId, UserInvitationStatus status) {
        boolean invitationExists = userInvitationRepository.existsByOrganizationAndUserAndStatus(organizationId, userId, status);
        if (!invitationExists) {
            throw new EntityNotFoundException(String.format("Unable to find User Invitation for User with id: %s", userId));
        }
    }

    private UserInvitationEntity findById(Long id) {
        return userInvitationRepository.findById(id)
            .orElseThrow(() -> {
                log.error("Unable to find User invitation with ID {}", id);
                throw new EntityNotFoundException(
                    String.format("Unable to find invitation with ID %s", id));
            });
    }

    private InviteUsersRequest buildInviteRequest(Organization organization, Set<String> emails, Set<Role> roles) {
        InviteUsersRequest inviteUsersRequest = new InviteUsersRequest();
        inviteUsersRequest.setOrganization(organization);
        inviteUsersRequest.setEmails(emails);
        inviteUsersRequest.setRoles(roles);
        return inviteUsersRequest;
    }
}
