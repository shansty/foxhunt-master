package com.itechart.foxhunt.api.user.email.password;

import com.itechart.foxhunt.api.user.ResetPasswordRequestStatus;
import com.itechart.foxhunt.api.user.dao.ResetPasswordRequestRepository;
import com.itechart.foxhunt.api.user.dto.ResetPasswordRequest;
import com.itechart.foxhunt.api.user.dto.User;
import com.itechart.foxhunt.api.user.email.EmailTemplateRepository;
import com.itechart.foxhunt.api.user.entity.ResetPasswordRequestEntity;
import com.itechart.foxhunt.api.user.mapper.ResetPasswordRequestMapper;
import com.itechart.foxhunt.domain.entity.EmailTemplateEntity;
import com.itechart.foxhunt.domain.utils.TemplateConstants;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionTemplate;

@Service
@Slf4j
public class UnregisteredUserResetPasswordHandler extends ResetPasswordRequestHandler {

    public UnregisteredUserResetPasswordHandler(TransactionTemplate transactionTemplate,
                                                UnregisteredUserResetPasswordEmailHandler emailHandler,
                                                EmailTemplateRepository emailTemplateRepository,
                                                ResetPasswordRequestRepository resetPasswordRequestRepository,
                                                ResetPasswordRequestMapper resetPasswordRequestMapper) {
        super(transactionTemplate, emailHandler, emailTemplateRepository, resetPasswordRequestRepository, resetPasswordRequestMapper);
    }

    @Override
    protected ResetPasswordRequest createRequest(User userRequestedPasswordReset) {
        log.info("Creating reset password request for unregistered user: {}", userRequestedPasswordReset.getEmail());
        EmailTemplateEntity emailTemplate = emailTemplateRepository.findByName(
            TemplateConstants.RESET_PASSWORD_FOR_NON_EXISTING_USER_TEMPLATE);
        ResetPasswordRequestEntity resetPasswordRequestEntity = buildResetPasswordRequestEntity(userRequestedPasswordReset, emailTemplate);

        ResetPasswordRequestEntity savedResetPasswordRequest = resetPasswordRequestRepository.save(resetPasswordRequestEntity);
        return buildResetPasswordRequestDto(savedResetPasswordRequest, userRequestedPasswordReset);
    }

    @Override
    protected ResetPasswordRequestEntity buildResetPasswordRequestEntity(User user, EmailTemplateEntity emailTemplate) {
        ResetPasswordRequestEntity resetPasswordRequestEntity = super.buildResetPasswordRequestEntity(user, emailTemplate);
        resetPasswordRequestEntity.setStatus(ResetPasswordRequestStatus.INVALID);
        return resetPasswordRequestEntity;
    }
}
