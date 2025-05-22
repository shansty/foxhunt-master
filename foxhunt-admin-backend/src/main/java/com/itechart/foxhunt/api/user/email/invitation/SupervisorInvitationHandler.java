package com.itechart.foxhunt.api.user.email.invitation;

import com.itechart.foxhunt.api.organization.Organization;
import com.itechart.foxhunt.api.user.dao.UserInvitationRepository;
import com.itechart.foxhunt.api.user.dto.InviteUsersRequest;
import com.itechart.foxhunt.api.user.dto.User;
import com.itechart.foxhunt.api.user.dto.UserInvitation;
import com.itechart.foxhunt.api.user.email.EmailTemplateRepository;
import com.itechart.foxhunt.api.user.mapper.UserInvitationMapper;
import com.itechart.foxhunt.api.user.service.OrganizationUserRoleService;
import com.itechart.foxhunt.api.user.service.UserService;
import com.itechart.foxhunt.domain.entity.EmailTemplateEntity;
import com.itechart.foxhunt.domain.entity.OrganizationUserRoleEntity;
import com.itechart.foxhunt.domain.entity.UserInvitationEntity;
import com.itechart.foxhunt.domain.enums.Role;
import com.itechart.foxhunt.domain.utils.TemplateConstants;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.support.TransactionTemplate;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@Slf4j
public class SupervisorInvitationHandler extends UserInvitationHandler {

    public SupervisorInvitationHandler(TransactionTemplate transactionTemplate,
                                       UserInvitationRepository userInvitationRepository,
                                       EmailTemplateRepository emailTemplateRepository,
                                       UserInvitationMapper userInvitationMapper,
                                       SupervisorInvitationEmailHandler emailHandler,
                                       UserService userService,
                                       OrganizationUserRoleService userRoleService) {
        super(transactionTemplate, emailHandler, userInvitationRepository, emailTemplateRepository, userInvitationMapper,
            userService, userRoleService);
    }

    @Override
    protected List<UserInvitation> createRequest(InviteUsersRequest inviteRequest) {
        Set<String> emails = inviteRequest.getEmails();
        Organization organization = inviteRequest.getOrganization();
        Role role = inviteRequest.getRoles().stream()
            .findFirst()
            .orElse(null);
        log.info("Inviting users with emails {} to organization {} with role {}", emails, organization.getId(), role);

        log.debug("Fetching users with emails {}", emails);
        Set<User> usersToInvite = takeUsers(emails);
        log.debug("Adding users {} to organization {}", usersToInvite, organization.getId());
        List<OrganizationUserRoleEntity> savedOrganizationUserRoles = usersToInvite.stream()
            .map(user -> userRoleService.addUserToOrganization(organization.getId(), user, role))
            .collect(Collectors.toList());
        log.debug("Fetching invitation template for role {}", role);
        EmailTemplateEntity trainerTemplate = retrieveEmailTemplate(role);

        List<UserInvitationEntity> invitationsToSave =
            buildInvitationEntities(organization.getId(), savedOrganizationUserRoles, trainerTemplate);
        log.debug("Saving invitations for users with emails {} and role {}", emails, role);
        List<UserInvitationEntity> savedInvitations = userInvitationRepository.saveAll(invitationsToSave);

        return buildInvitations(savedInvitations, organization);
    }

    private EmailTemplateEntity retrieveEmailTemplate(Role role) {
        String template = role == Role.TRAINER ?
            TemplateConstants.TRAINER_TEMPLATE :
            TemplateConstants.ORGANIZATION_ADMIN_TEMPLATE;
        return emailTemplateRepository.findByName(template);
    }

    private List<UserInvitationEntity> buildInvitationEntities(Long organizationId,
                                                               List<OrganizationUserRoleEntity> userRoleEntities,
                                                               EmailTemplateEntity emailTemplate) {
        return userRoleEntities.stream()
            .map(userRoleEntity -> buildInvitationEntity(organizationId, userRoleEntity.getUserEntity(), emailTemplate))
            .collect(Collectors.toList());
    }

}
