package com.itechart.foxhunt.api.user.email.role;

import com.github.jknack.handlebars.internal.lang3.StringUtils;
import com.itechart.foxhunt.api.organization.Organization;
import com.itechart.foxhunt.api.user.dto.User;
import com.itechart.foxhunt.api.user.email.EmailHandler;
import com.itechart.foxhunt.domain.enums.Role;
import com.itechart.foxhunt.domain.utils.TemplateConstants;
import com.itechart.foxhunt.email.dto.MailDto;
import com.itechart.foxhunt.email.servcie.EmailService;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ChangingRoleEmailHandler extends EmailHandler<ChangingRoleInfoKeeper> {

    public ChangingRoleEmailHandler(EmailService emailService) {
        super(emailService);
    }

    @Override
    protected MailDto createMail(ChangingRoleInfoKeeper message, List<String> bccList) {
        MailDto mailDto = new MailDto();
        mailDto.setToList(List.of(message.getUser().getEmail()));
        mailDto.setSubject(message.getEmailTemplateEntity().getSubject());
        mailDto.setBccList(bccList);
        mailDto.setText(message.getEmailTemplateEntity().getMessage());
        mailDto.setTextTemplateValuesMap(createMapWithTemplateValues(message));
        return mailDto;
    }

    @Override
    protected Map<String, Object> createMapWithTemplateValues(ChangingRoleInfoKeeper message) {
        User user = message.getUser();
        Organization organization = message.getOrganization();
        Map<String, Object> map = new HashMap<>();

        map.put(TemplateConstants.USERNAME, String.format("%s %s", user.getFirstName(), user.getLastName()));
        map.put(TemplateConstants.ORGANIZATION_NAME, organization.getName());
        map.put(TemplateConstants.ORGANIZATION_DOMAIN, organization.getOrganizationDomain());
        map.put(TemplateConstants.OLD_ROLES, combineAll(message.getOldRoles()));
        map.put(TemplateConstants.UPDATED_ROLES, combineAll(message.getUpdatedRoles()));
        return map;
    }

    private String combineAll(Set<Role> roles) {
        String result = roles.stream().map(role -> {
            String lowerName = StringUtils.lowerCase(role.name()).replace("_", " ");
            return StringUtils.capitalize(lowerName);
        }).collect(Collectors.joining(", "));
        return result.isEmpty() ? "-" : result;
    }
}
