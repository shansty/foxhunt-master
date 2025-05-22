package com.itechart.foxhunt.email.servcie;

import com.itechart.foxhunt.email.dto.MailDto;

import java.util.List;

public interface EmailService {

    void sendSimpleMessage(MailDto mailDto);

    void sendTemplateMessage(MailDto mailDto);

    void sendTemplateMessage(List<MailDto> mails);

}
