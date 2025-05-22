package com.itechart.foxhunt.api.user.email.password;

import com.itechart.foxhunt.api.user.dao.ResetPasswordRequestRepository;
import com.itechart.foxhunt.api.user.dto.ResetPasswordRequest;
import com.itechart.foxhunt.api.user.dto.User;
import com.itechart.foxhunt.api.user.email.EmailHandler;
import com.itechart.foxhunt.api.user.email.EmailTemplateRepository;
import com.itechart.foxhunt.api.user.email.UserRequestHandler;
import com.itechart.foxhunt.api.user.entity.ResetPasswordRequestEntity;
import com.itechart.foxhunt.api.user.mapper.ResetPasswordRequestMapper;
import com.itechart.foxhunt.domain.entity.EmailTemplateEntity;
import lombok.extern.slf4j.Slf4j;
import org.springframework.transaction.support.TransactionTemplate;

import java.time.LocalDateTime;

@Slf4j
public abstract class ResetPasswordRequestHandler extends UserRequestHandler<User, ResetPasswordRequest> {

    protected final EmailHandler<ResetPasswordRequest> emailHandler;
    protected final EmailTemplateRepository emailTemplateRepository;
    protected final ResetPasswordRequestRepository resetPasswordRequestRepository;
    protected final ResetPasswordRequestMapper resetPasswordRequestMapper;

    public ResetPasswordRequestHandler(TransactionTemplate transactionTemplate,
                                       EmailHandler<ResetPasswordRequest> emailHandler,
                                       EmailTemplateRepository emailTemplateRepository,
                                       ResetPasswordRequestRepository resetPasswordRequestRepository,
                                       ResetPasswordRequestMapper resetPasswordRequestMapper) {
        super(transactionTemplate);
        this.emailHandler = emailHandler;
        this.emailTemplateRepository = emailTemplateRepository;
        this.resetPasswordRequestRepository = resetPasswordRequestRepository;
        this.resetPasswordRequestMapper = resetPasswordRequestMapper;
    }

    @Override
    public void processRequest(ResetPasswordRequest resetPasswordRequest) {
        log.info("Sending reset password mail to {}", resetPasswordRequest.getUser().getEmail());
        emailHandler.processMessage(resetPasswordRequest);
    }

    protected ResetPasswordRequestEntity buildResetPasswordRequestEntity(User user,
                                                                         EmailTemplateEntity emailTemplate) {
        ResetPasswordRequestEntity resetPasswordRequestEntity = new ResetPasswordRequestEntity();
        resetPasswordRequestEntity.setUserEmail(user.getEmail());
        resetPasswordRequestEntity.setEmailTemplateEntity(emailTemplate);
        resetPasswordRequestEntity.setRequestDate(LocalDateTime.now());

        return resetPasswordRequestEntity;
    }

    protected ResetPasswordRequest buildResetPasswordRequestDto(ResetPasswordRequestEntity resetPasswordRequestEntity,
                                                                User user) {
        return resetPasswordRequestMapper.entityToDomain(resetPasswordRequestEntity, user);
    }
}
