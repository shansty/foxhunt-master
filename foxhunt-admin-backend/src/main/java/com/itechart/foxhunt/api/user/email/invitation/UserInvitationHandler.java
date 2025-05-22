package com.itechart.foxhunt.api.user.email.invitation;

import com.itechart.foxhunt.api.exception.InternalServerErrorException;
import com.itechart.foxhunt.api.organization.Organization;
import com.itechart.foxhunt.api.user.dao.UserInvitationRepository;
import com.itechart.foxhunt.api.user.dto.InviteUsersRequest;
import com.itechart.foxhunt.api.user.dto.User;
import com.itechart.foxhunt.api.user.dto.UserInvitation;
import com.itechart.foxhunt.api.user.email.EmailHandler;
import com.itechart.foxhunt.api.user.email.EmailTemplateRepository;
import com.itechart.foxhunt.api.user.email.UserRequestHandler;
import com.itechart.foxhunt.api.user.mapper.UserInvitationMapper;
import com.itechart.foxhunt.api.user.service.OrganizationUserRoleService;
import com.itechart.foxhunt.api.user.service.UserService;
import com.itechart.foxhunt.domain.entity.EmailTemplateEntity;
import com.itechart.foxhunt.domain.entity.UserEntity;
import com.itechart.foxhunt.domain.entity.UserInvitationEntity;
import com.itechart.foxhunt.domain.enums.UserInvitationStatus;
import lombok.extern.slf4j.Slf4j;
import org.springframework.transaction.support.TransactionTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
public abstract class UserInvitationHandler extends UserRequestHandler<InviteUsersRequest, List<UserInvitation>> {

    protected final EmailHandler<UserInvitation> emailHandler;
    protected final UserInvitationRepository userInvitationRepository;
    protected final EmailTemplateRepository emailTemplateRepository;
    protected final UserInvitationMapper userInvitationMapper;
    protected final UserService userService;
    protected final OrganizationUserRoleService userRoleService;

    public UserInvitationHandler(TransactionTemplate transactionTemplate,
                                 EmailHandler<UserInvitation> emailHandler,
                                 UserInvitationRepository userInvitationRepository,
                                 EmailTemplateRepository emailTemplateRepository,
                                 UserInvitationMapper userInvitationMapper,
                                 UserService userService,
                                 OrganizationUserRoleService userRoleService) {
        super(transactionTemplate);
        this.emailHandler = emailHandler;
        this.userInvitationRepository = userInvitationRepository;
        this.emailTemplateRepository = emailTemplateRepository;
        this.userInvitationMapper = userInvitationMapper;
        this.userService = userService;
        this.userRoleService = userRoleService;
    }

    @Override
    public List<UserInvitation> handleRequest(InviteUsersRequest request) {
        validateRequest(request);
        return request.getEmails().isEmpty() ? List.of() : sendInvitation(request);
    }

    private List<UserInvitation> sendInvitation(InviteUsersRequest request) {
        List<UserInvitation> createdRequest = transactionTemplate.execute(status -> createRequest(request));
        processRequest(createdRequest);
        return createdRequest;
    }

    @Override
    protected void validateRequest(InviteUsersRequest inviteRequest) {
        filterBannedEmails(inviteRequest.getEmails());
        filterActiveEmails(inviteRequest.getOrganization().getId(), inviteRequest.getEmails());
    }

    private void filterBannedEmails(Set<String> emails) {
        Set<String> bannedEmails = userService.findByEmails(emails).stream()
            .filter(User::isBanned)
            .map(User::getEmail)
            .collect(Collectors.toSet());
        if (!bannedEmails.isEmpty()) {
            log.info("Users with the next emails was banned and won't get an invitation: {}", bannedEmails);
            emails.removeAll(bannedEmails);
        }
    }

    private void filterActiveEmails(Long organizationId, Set<String> emails) {
        Set<String> activeEmails =
            userRoleService.findAllByOrganizationAndUserEmailsAndActiveStatus(organizationId, emails, true).stream()
                .map(orgUserRoles -> orgUserRoles.getUserEntity().getEmail())
                .collect(Collectors.toSet());
        if (!activeEmails.isEmpty()) {
            log.info("Users with the next emails have active status in organization and won't get an invitation: {}", activeEmails);
            emails.removeAll(activeEmails);
        }
    }

    @Override
    protected void processRequest(List<UserInvitation> userInvitations) {
        List<String> invitationEmails = userInvitations.stream()
            .map(invitation -> invitation.getUser().getEmail())
            .collect(Collectors.toList());
        try {
            log.info("Sending invitation to users {}", invitationEmails);
            emailHandler.processMessage(userInvitations);
            log.info("Invitation to {} was sent successfully", invitationEmails);
        } catch (Exception e) {
            handleFailedInvitations(userInvitations, e.getMessage());
            throw new InternalServerErrorException(
                String.format("Error while sending invitations to %s", invitationEmails), e);
        }
    }

    protected void handleFailedInvitations(List<UserInvitation> userInvitations, String failureReason) {
        List<Long> invitationIds = userInvitations.stream()
            .map(UserInvitation::getUserInvitationId)
            .collect(Collectors.toList());
        List<UserInvitationEntity> invitationsToMarkFailed = userInvitationRepository
            .findAllById(invitationIds).stream()
            .peek(invitation -> {
                invitation.setStatus(UserInvitationStatus.FAILED);
                invitation.setFailureReason(failureReason);
            }).collect(Collectors.toList());
        userInvitationRepository.saveAll(invitationsToMarkFailed);
    }

    protected UserInvitationEntity buildInvitationEntity(Long organizationId, UserEntity userEntity,
                                                         EmailTemplateEntity emailTemplate) {
        UserInvitationEntity userInvitationEntity = new UserInvitationEntity();
        userInvitationEntity.setUserEntity(userEntity);
        userInvitationEntity.setOrganizationId(organizationId);
        userInvitationEntity.setStartDate(LocalDateTime.now());
        userInvitationEntity.setEndDate(LocalDateTime.now().plusHours(24));
        userInvitationEntity.setToken(UUID.randomUUID().toString());
        userInvitationEntity.setStatus(UserInvitationStatus.NEW);
        userInvitationEntity.setEmailTemplateEntity(emailTemplate);
        return userInvitationEntity;
    }

    protected List<UserInvitation> buildInvitations(List<UserInvitationEntity> invitations, Organization organization) {
        return invitations.stream().map(invitation -> buildInvitation(invitation, organization))
            .collect(Collectors.toList());
    }

    protected UserInvitation buildInvitation(UserInvitationEntity invitation, Organization organization) {
        return userInvitationMapper.entityToDomain(invitation, organization);
    }

    protected Set<User> takeUsers(Set<String> emails) {
        return emails.stream()
            .map(this::prepareUser)
            .collect(Collectors.toSet());
    }

    protected User prepareUser(String email) {
        User user = new User();
        user.setEmail(email);
        return userService.getOrCreateIfNotExists(user);
    }

}
