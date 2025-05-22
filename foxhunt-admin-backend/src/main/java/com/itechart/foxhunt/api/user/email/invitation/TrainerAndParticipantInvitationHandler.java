package com.itechart.foxhunt.api.user.email.invitation;

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
import com.itechart.foxhunt.domain.entity.UserEntity;
import com.itechart.foxhunt.domain.entity.UserInvitationEntity;
import com.itechart.foxhunt.domain.utils.TemplateConstants;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.support.TransactionTemplate;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@Slf4j
public class TrainerAndParticipantInvitationHandler extends UserInvitationHandler {

    public TrainerAndParticipantInvitationHandler(TransactionTemplate transactionTemplate,
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
        Long organizationId = inviteRequest.getOrganization().getId();
        Set<User> users = takeUsers(inviteRequest.getEmails());
        List<OrganizationUserRoleEntity> orgUserRoles =
            userRoleService.addUsersToOrganization(organizationId, users, inviteRequest.getRoles());
        Set<UserEntity> userEntities = orgUserRoles.stream()
            .map(OrganizationUserRoleEntity::getUserEntity)
            .collect(Collectors.toSet());
        EmailTemplateEntity emailTemplate =
            emailTemplateRepository.findByName(TemplateConstants.TRAINER_AND_PARTICIPANT_INVITATION_TEMPLATE);
        List<UserInvitationEntity> invitations = userEntities.stream()
            .map(userEntity -> buildInvitationEntity(organizationId, userEntity, emailTemplate))
            .collect(Collectors.toList());
        List<UserInvitationEntity> savedInvitations = userInvitationRepository.saveAll(invitations);
        return buildInvitations(savedInvitations, inviteRequest.getOrganization());
    }

}
