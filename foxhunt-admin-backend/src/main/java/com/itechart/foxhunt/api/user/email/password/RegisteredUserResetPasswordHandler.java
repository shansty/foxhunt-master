package com.itechart.foxhunt.api.user.email.password;

import com.itechart.foxhunt.api.user.ResetPasswordRequestStatus;
import com.itechart.foxhunt.api.user.dao.ResetPasswordRequestRepository;
import com.itechart.foxhunt.api.user.dto.ResetPasswordRequest;
import com.itechart.foxhunt.api.user.dto.User;
import com.itechart.foxhunt.api.user.email.EmailTemplateRepository;
import com.itechart.foxhunt.api.user.entity.ResetPasswordRequestEntity;
import com.itechart.foxhunt.api.user.mapper.ResetPasswordRequestMapper;
import com.itechart.foxhunt.api.user.service.UserService;
import com.itechart.foxhunt.domain.entity.EmailTemplateEntity;
import com.itechart.foxhunt.domain.utils.TemplateConstants;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionTemplate;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@Slf4j
public class RegisteredUserResetPasswordHandler extends ResetPasswordRequestHandler {

    private final UserService userService;

    public RegisteredUserResetPasswordHandler(TransactionTemplate transactionTemplate,
                                              EmailTemplateRepository emailTemplateRepository,
                                              ResetPasswordRequestRepository resetPasswordRequestRepository,
                                              ResetPasswordRequestMapper resetPasswordRequestMapper,
                                              RegisteredUserResetPasswordEmailHandler emailHandler,
                                              UserService userService) {
        super(transactionTemplate, emailHandler, emailTemplateRepository, resetPasswordRequestRepository, resetPasswordRequestMapper);
        this.userService = userService;
    }

    @Override
    protected ResetPasswordRequest createRequest(User userRequestedPasswordReset) {
        log.info("Creating reset password request for registered user: {}", userRequestedPasswordReset.getEmail());
        User user = userService.findByEmail(userRequestedPasswordReset.getEmail());
        EmailTemplateEntity emailTemplate = getEmailTemplate(user);
        ResetPasswordRequestEntity resetPasswordRequestEntity = buildResetPasswordRequestEntity(user, emailTemplate);

        ResetPasswordRequestEntity savedResetPasswordRequest = resetPasswordRequestRepository.save(resetPasswordRequestEntity);
        return buildResetPasswordRequestDto(savedResetPasswordRequest, user);
    }

    private EmailTemplateEntity getEmailTemplate(User user) {
        log.info("Fetching email template for user: {}", user.getEmail());
        String templateName = isPasswordEmpty(user) ? TemplateConstants.RESET_PASSWORD_FOR_EXISTING_USER_WITHOUT_IT_TEMPLATE :
            TemplateConstants.RESET_PASSWORD_FOR_EXISTING_USER_WITH_IT_TEMPLATE;
        EmailTemplateEntity fetchedTemplate = emailTemplateRepository.findByName(templateName);
        log.debug("Fetched email template: {}", fetchedTemplate.getName());
        return fetchedTemplate;
    }

    @Override
    protected ResetPasswordRequestEntity buildResetPasswordRequestEntity(User user, EmailTemplateEntity emailTemplate) {
        ResetPasswordRequestEntity resetPasswordRequestEntity = super.buildResetPasswordRequestEntity(user, emailTemplate);
        resetPasswordRequestEntity.setUserExisted(true);

        if (isPasswordEmpty(user)) {
            resetPasswordRequestEntity.setStatus(ResetPasswordRequestStatus.INVALID);
        } else {
            resetPasswordRequestEntity.setExpirationDate(LocalDateTime.now().plusDays(1));
            resetPasswordRequestEntity.setToken(UUID.randomUUID().toString());
            resetPasswordRequestEntity.setStatus(ResetPasswordRequestStatus.NEW);
        }

        return resetPasswordRequestEntity;
    }

    private boolean isPasswordEmpty(User user) {
        return (user.getPassword() != null && user.getPassword().isEmpty());
    }

}
