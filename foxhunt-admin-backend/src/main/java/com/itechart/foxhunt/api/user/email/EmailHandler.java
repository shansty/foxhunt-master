package com.itechart.foxhunt.api.user.email;

import com.itechart.foxhunt.email.dto.MailDto;
import com.itechart.foxhunt.email.servcie.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@ComponentScan(basePackages = {"com.itechart.foxhunt.email"})
@Service
@RequiredArgsConstructor
public abstract class EmailHandler<T> {

    private final EmailService emailService;

    public void processMessage(T message) {
        processMessage(message, List.of());
    }

    public void processMessage(T message, List<String> bccList) {
        MailDto mail = createMail(message, bccList);
        sendMessage(mail);
    }

    public void processMessage(List<T> messages) {
        processMessage(messages, List.of());
    }

    public void processMessage(List<T> messages, List<String> bccList) {
        List<MailDto> mails = createMail(messages, bccList);
        sendMessage(mails);
    }

    protected void sendMessage(MailDto mail) {
        emailService.sendTemplateMessage(mail);
    }

    protected void sendMessage(List<MailDto> mails) {
        emailService.sendTemplateMessage(mails);
    }

    protected List<MailDto> createMail(List<T> messages, List<String> bccList) {
        return messages.stream().map(message -> createMail(message, bccList)).collect(Collectors.toList());
    }

    protected abstract MailDto createMail(T message, List<String> bccList);

    protected abstract Map<String, Object> createMapWithTemplateValues(T message);


}
