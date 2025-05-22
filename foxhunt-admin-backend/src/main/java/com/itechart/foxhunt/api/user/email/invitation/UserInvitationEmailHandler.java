package com.itechart.foxhunt.api.user.email.invitation;

import com.itechart.foxhunt.api.user.dto.UserInvitation;
import com.itechart.foxhunt.api.user.email.EmailHandler;
import com.itechart.foxhunt.email.dto.MailDto;
import com.itechart.foxhunt.email.servcie.EmailService;

import java.util.List;

public abstract class UserInvitationEmailHandler extends EmailHandler<UserInvitation> {

    public UserInvitationEmailHandler(EmailService emailService) {
        super(emailService);
    }

    @Override
    protected MailDto createMail(UserInvitation message, List<String> bccList) {
        MailDto mailDto = new MailDto();
        mailDto.setToList(List.of(message.getUser().getEmail()));
        mailDto.setBccList(bccList);
        mailDto.setSubject(message.getEmailTemplateEntity().getSubject());
        mailDto.setText(message.getEmailTemplateEntity().getMessage());
        mailDto.setTextTemplateValuesMap(createMapWithTemplateValues(message));
        return mailDto;
    }

}
