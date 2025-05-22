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
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.support.TransactionTemplate;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@Slf4j
public class ParticipantInvitationHandler extends UserInvitationHandler {

    private final BCryptPasswordEncoder passwordEncoder;

    public ParticipantInvitationHandler(TransactionTemplate transactionTemplate,
                                        UserInvitationRepository userInvitationRepository,
                                        EmailTemplateRepository emailTemplateRepository,
                                        UserInvitationMapper userInvitationMapper,
                                        ParticipantInvitationEmailHandler emailHandler,
                                        UserService userService,
                                        OrganizationUserRoleService userRoleService,
                                        BCryptPasswordEncoder passwordEncoder) {
        super(transactionTemplate, emailHandler, userInvitationRepository, emailTemplateRepository, userInvitationMapper,
            userService, userRoleService);
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    protected List<UserInvitation> createRequest(InviteUsersRequest inviteRequest) {
        Set<String> emails = inviteRequest.getEmails();
        Organization organization = inviteRequest.getOrganization();
        Role role = inviteRequest.getRoles().stream()
            .findFirst()
            .orElse(null);
        log.info("Inviting users with emails {} to organization {} with role {}", emails, organization, role);

        log.debug("Fetching users with emails {}", emails);
        Map<String, User> usersToInvite = takeUserByEmail(emails);
        log.debug("Adding users {} to organization {}", emails, organization.getId());
        Map<String, OrganizationUserRoleEntity> userRolesByEmails = usersToInvite.values().stream()
            .collect(Collectors.toMap(User::getEmail,
                user -> userRoleService.addUserToOrganization(organization.getId(), user, role)));
        log.debug("Fetching invitation email templates for users {}", emails);
        Map<String, EmailTemplateEntity> templatesByEmails = findEmailTemplatesByEmails(emails);

        List<UserInvitationEntity> invitationsToSave = emails.stream()
            .map(email -> buildInvitationEntity(
                organization.getId(), userRolesByEmails.get(email).getUserEntity(), templatesByEmails.get(email)))
            .collect(Collectors.toList());
        log.debug("Saving invitation for users with emails {} and role {}", emails, role);
        List<UserInvitationEntity> savedInvitation = userInvitationRepository.saveAll(invitationsToSave);

        return buildInvitations(savedInvitation, organization).stream().peek(invitation -> {
            String rawPassword = usersToInvite.get(invitation.getUser().getEmail()).getPassword();
            invitation.getUser().setPassword(rawPassword);
        }).collect(Collectors.toList());
    }

    @Override
    protected User prepareUser(String email) {
        User user = new User();
        user.setEmail(email);

        String generatedPassword = generatePassword();
        user.setPassword(passwordEncoder.encode(generatedPassword));

        User userToInvite = userService.getOrCreateIfNotExists(user);
        userToInvite.setPassword(generatedPassword);
        return userToInvite;
    }

    private Map<String, User> takeUserByEmail(Set<String> emails) {
        return takeUsers(emails).stream()
            .collect(Collectors.toMap(User::getEmail, user -> user));
    }

    private String generatePassword() {
        int passwordLength = 8;
        boolean useLetters = true;
        boolean useNumbers = true;
        return RandomStringUtils.random(passwordLength, useLetters, useNumbers);
    }

    private Map<String, EmailTemplateEntity> findEmailTemplatesByEmails(Set<String> emails) {
        return emails.stream().collect(Collectors.toMap(email -> email, this::findEmailTemplateByEmail));
    }

    private EmailTemplateEntity findEmailTemplateByEmail(String email) {
        boolean isNewUser = !userService.existsByEmailAndActive(email);
        String templateName = isNewUser ?
            TemplateConstants.NEW_USER_PARTICIPANT_TEMPLATE
            : TemplateConstants.EXISTING_USER_PARTICIPANT_TEMPLATE;
        return emailTemplateRepository.findByName(templateName);
    }

}
