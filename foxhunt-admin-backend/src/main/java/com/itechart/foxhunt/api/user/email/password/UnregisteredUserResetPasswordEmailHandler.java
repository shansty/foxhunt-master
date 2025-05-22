package com.itechart.foxhunt.api.user.email.password;

import com.itechart.foxhunt.api.user.dto.ResetPasswordRequest;
import com.itechart.foxhunt.email.servcie.EmailService;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Map;

@Service
public class UnregisteredUserResetPasswordEmailHandler extends ResetPasswordEmailHandler {

    public UnregisteredUserResetPasswordEmailHandler(EmailService emailService) {
        super(emailService);
    }

    @Override
    protected Map<String, Object> createMapWithTemplateValues(ResetPasswordRequest resetPasswordRequest) {
        return Collections.emptyMap();
    }
}
