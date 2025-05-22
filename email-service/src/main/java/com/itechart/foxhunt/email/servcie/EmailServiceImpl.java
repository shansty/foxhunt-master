package com.itechart.foxhunt.email.servcie;

import com.itechart.foxhunt.email.dto.MailDto;
import freemarker.template.TemplateException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import javax.mail.Message;
import javax.mail.Message.RecipientType;
import javax.mail.MessagingException;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {

    @Value("${spring.mail.username}")
    private String mailServerUsername;

    private final JavaMailSender mailSender;

    private final TemplateCompiler templateCompiler;

    @Override
    public void sendSimpleMessage(MailDto mailDto) {
        MimeMessage message = mailSender.createMimeMessage();
        sendMessage(message, mailDto);
    }

    @Override
    public void sendTemplateMessage(List<MailDto> mails) {
        MimeMessage[] messagesToSend = buildMessagesToSend(mails);
        mailSender.send(messagesToSend);
    }

    private MimeMessage[] buildMessagesToSend(List<MailDto> mails) {
        return mails.stream().map(this::buildMessage).toArray(MimeMessage[]::new);
    }

    @Override
    public void sendTemplateMessage(MailDto mailDto) {
        MimeMessage message = buildMessage(mailDto);
        sendMessage(message, mailDto);
    }

    private MimeMessage buildMessage(MailDto mailDto) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            setText(message, mailDto);
            message.setFrom(mailServerUsername);
            addRecipients(message, mailDto.getToList(), Message.RecipientType.TO);
            addRecipients(message, mailDto.getBccList(), RecipientType.BCC);
            addRecipients(message, mailDto.getCcList(), RecipientType.CC);
            setSubject(message, mailDto);
            return message;
        } catch (Exception e) {
            log.error("Template didn't compile to: {}", mailDto.getToList());
            log.error("Template didn't compile to BCC: {}", mailDto.getBccList());
            log.error("Template didn't compile to CC: {}", mailDto.getCcList());
            throw new IllegalArgumentException(
                    String.format("Template didn't compile to: %s BCC: %s CC: %s",
                            mailDto.getToList(), mailDto.getBccList(), mailDto.getCcList()));
        }
    }

    private void sendMessage(MimeMessage message, MailDto mailDto) {
        log.info("Message sent to: {}", mailDto.getToList());
        log.info("Message sent to BCC: {}", mailDto.getBccList());
        log.info("Message sent to CC: {}", mailDto.getCcList());
        try {
            mailSender.send(message);
        } catch (Exception e) {
            log.error("Message didn't sent to: {}", mailDto.getToList());
            log.error("Message didn't sent to BCC: {}", mailDto.getBccList());
            log.error("Message didn't sent to CC: {}", mailDto.getCcList());
            throw new IllegalArgumentException(e.getLocalizedMessage(), e);
        }
    }

    private void setText(MimeMessage message, MailDto mailDto) throws MessagingException, IOException, TemplateException {
        String mailText = mailDto.getText();

        if (mailText != null) {
            Map<String, Object> textTemplateValues = mailDto.getTextTemplateValuesMap();
            if (textTemplateValues.isEmpty()) {
                message.setContent(mailText, MediaType.TEXT_HTML_VALUE);
            } else {
                String compiledMailContent = templateCompiler.compileMessageTemplate(textTemplateValues, mailText);
                message.setContent(compiledMailContent, MediaType.TEXT_HTML_VALUE);
            }
        }
    }

    private void setSubject(MimeMessage message, MailDto mailDto) throws MessagingException {
        String mailSubject = mailDto.getSubject();

        if (mailSubject != null) {
            Map<String, Object> subjectTemplateValues = mailDto.getSubjectTemplateValuesMap();
            if (subjectTemplateValues.isEmpty()) {
                message.setSubject(mailSubject);
            } else {
                String compiledTemplateSubject = templateCompiler.compileSubjectTemplate(subjectTemplateValues, mailSubject);
                message.setSubject(compiledTemplateSubject);
            }
        }
    }

    private void addRecipients(MimeMessage message, List<String> recipientsList,
                               RecipientType recipientType) throws MessagingException {
        if (!recipientsList.isEmpty()) {
            InternetAddress[] internetAddresses = recipientsList.stream()
                    .map(this::createInternetAddress)
                    .toArray(InternetAddress[]::new);
            message.addRecipients(recipientType, internetAddresses);
        }
    }

    private InternetAddress createInternetAddress(String recipient) {
        try {
            return new InternetAddress(recipient);
        } catch (AddressException e) {
            log.error("Can't add recipient: {}", recipient);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error occurred while sending email");
        }
    }

}
