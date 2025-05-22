package com.itechart.foxhunt.api.user.email.invitation;

import com.itechart.foxhunt.api.organization.Organization;
import com.itechart.foxhunt.api.user.dto.User;
import com.itechart.foxhunt.api.user.dto.UserInvitation;
import com.itechart.foxhunt.domain.utils.TemplateConstants;
import com.itechart.foxhunt.email.servcie.EmailService;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class ParticipantInvitationEmailHandler extends UserInvitationEmailHandler {

    public ParticipantInvitationEmailHandler(EmailService emailService) {
        super(emailService);
    }

    @Override
    protected Map<String, Object> createMapWithTemplateValues(UserInvitation userInvitation) {
        Organization organization = userInvitation.getOrganization();
        User user = userInvitation.getUser();
        Map<String, Object> map = new HashMap<>();
        map.put(TemplateConstants.USERNAME, user.getEmail());
        map.put(TemplateConstants.PASSWORD, user.getPassword());
        map.put(TemplateConstants.ORGANIZATION_NAME, organization.getName());
        map.put(TemplateConstants.ORGANIZATION_DOMAIN, organization.getOrganizationDomain());
        return map;
    }
}
