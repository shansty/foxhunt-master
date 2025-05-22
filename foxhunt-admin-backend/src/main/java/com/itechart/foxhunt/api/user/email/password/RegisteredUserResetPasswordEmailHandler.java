package com.itechart.foxhunt.api.user.email.password;

import com.itechart.foxhunt.api.user.dto.ResetPasswordRequest;
import com.itechart.foxhunt.api.user.dto.User;
import com.itechart.foxhunt.domain.utils.TemplateConstants;
import com.itechart.foxhunt.domain.utils.URLConstants;
import com.itechart.foxhunt.email.servcie.EmailService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.HashMap;
import java.util.Map;

@Service
public class RegisteredUserResetPasswordEmailHandler extends ResetPasswordEmailHandler {

    public RegisteredUserResetPasswordEmailHandler(EmailService emailService) {
        super(emailService);
    }

    @Override
    protected Map<String, Object> createMapWithTemplateValues(ResetPasswordRequest resetPasswordRequest) {
        User user = resetPasswordRequest.getUser();
        Map<String, Object> map = new HashMap<>();

        if (!StringUtils.isEmpty(user.getPassword())) {
            map.put(TemplateConstants.RESET_PASSWORD_LINK,
                createLink(resetPasswordRequest.getToken()));
        }
        map.put(TemplateConstants.USERNAME, String.format("%s %s", user.getFirstName(), user.getLastName()));
        return map;
    }

    private String createLink(String token) {
        return UriComponentsBuilder
            .fromHttpUrl(URLConstants.HTTP)
            .path(URLConstants.RESET_PASSWORD)
            .path(URLConstants.SLASH)
            .path(token).toUriString();
    }
}
