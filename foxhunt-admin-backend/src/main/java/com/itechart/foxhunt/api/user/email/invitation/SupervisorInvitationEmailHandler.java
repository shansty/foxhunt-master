package com.itechart.foxhunt.api.user.email.invitation;

import com.itechart.foxhunt.api.organization.Organization;
import com.itechart.foxhunt.api.user.dto.UserInvitation;
import com.itechart.foxhunt.domain.utils.TemplateConstants;
import com.itechart.foxhunt.domain.utils.URLConstants;
import com.itechart.foxhunt.email.servcie.EmailService;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.HashMap;
import java.util.Map;

@Service
public class SupervisorInvitationEmailHandler extends UserInvitationEmailHandler {

    public SupervisorInvitationEmailHandler(EmailService emailService) {
        super(emailService);
    }

    @Override
    protected Map<String, Object> createMapWithTemplateValues(UserInvitation userInvitation) {
        Organization organization = userInvitation.getOrganization();
        String acceptLink = createLink(organization.getOrganizationDomain(),
            URLConstants.ACCEPTED, userInvitation.getToken());
        String declineLink = createLink(organization.getOrganizationDomain(),
            URLConstants.DECLINED, userInvitation.getToken());

        Map<String, Object> map = new HashMap<>();
        map.put(TemplateConstants.LINK_TO_ACCEPT, acceptLink);
        map.put(TemplateConstants.LINK_TO_DECLINE, declineLink);
        map.put(TemplateConstants.ORGANIZATION_NAME, organization.getName());
        map.put(TemplateConstants.ORGANIZATION_DOMAIN, organization.getOrganizationDomain());
        return map;
    }

    private String createLink(String orgDomain, String status, String token) {
        return UriComponentsBuilder
            .fromHttpUrl(URLConstants.HTTP)
            .path(URLConstants.VERIFY)
            .path(URLConstants.SLASH)
            .path(orgDomain)
            .path(URLConstants.INVITATION)
            .path(status)
            .path(URLConstants.SLASH)
            .path(token).toUriString();
    }
}
