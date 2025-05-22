package com.itechart.foxhunt.api.user.email.password;

import com.itechart.foxhunt.api.user.dto.ResetPasswordRequest;
import com.itechart.foxhunt.api.user.email.EmailHandler;
import com.itechart.foxhunt.email.dto.MailDto;
import com.itechart.foxhunt.email.servcie.EmailService;

import java.util.List;

public abstract class ResetPasswordEmailHandler extends EmailHandler<ResetPasswordRequest> {

    public ResetPasswordEmailHandler(EmailService emailService) {
        super(emailService);
    }

    @Override
    protected MailDto createMail(ResetPasswordRequest message, List<String> bccList) {
        MailDto mailDto = new MailDto();
        mailDto.setToList(List.of(message.getUser().getEmail()));
        mailDto.setSubject(message.getEmailTemplateEntity().getSubject());
        mailDto.setBccList(bccList);
        mailDto.setText(message.getEmailTemplateEntity().getMessage());
        mailDto.setTextTemplateValuesMap(createMapWithTemplateValues(message));
        return mailDto;
    }

}
