package com.itechart.foxhunt.api.user;

import com.itechart.foxhunt.api.user.dao.ResetPasswordRequestRepository;
import com.itechart.foxhunt.api.user.dto.User;
import com.itechart.foxhunt.api.user.email.password.ResetPasswordProcessingServiceImpl;
import com.itechart.foxhunt.api.user.entity.ResetPasswordRequestEntity;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Slf4j
public class PasswordServiceImpl implements PasswordService {

    private final ResetPasswordRequestRepository resetPasswordRequestRepository;

    private final ResetPasswordProcessingServiceImpl resetPasswordProcessingService;

    @Override
    public ResetPasswordRequestEntity processResetPasswordRequest(String token) {
        log.info("Processing user response on reset password request with token: {}", token);
        ResetPasswordRequestEntity resetPasswordRequestEntity = resetPasswordRequestRepository
            .findByTokenAndStatus(token, ResetPasswordRequestStatus.NEW)
            .orElseThrow(() -> {
                log.error("No reset password requests in DB with token: {}", token);
                throw new EntityNotFoundException(
                    String.format("No reset password requests in DB with token = %s", token));
            });

        if (checkResetPasswordRequestExpiration(resetPasswordRequestEntity)) {
            processValidToken(resetPasswordRequestEntity);
        } else {
            processExpiredToken(resetPasswordRequestEntity);
        }
        return resetPasswordRequestEntity;
    }

    private boolean checkResetPasswordRequestExpiration(
        ResetPasswordRequestEntity resetPasswordRequestEntity) {
        if (Objects.nonNull(resetPasswordRequestEntity)) {
            return resetPasswordRequestEntity.getExpirationDate().isAfter(LocalDateTime.now());
        }
        return false;
    }

    private void processExpiredToken(ResetPasswordRequestEntity resetPasswordRequestEntity) {
        resetPasswordRequestEntity.setStatus(ResetPasswordRequestStatus.EXPIRED);
        resetPasswordRequestRepository.save(resetPasswordRequestEntity);
        log.warn("Reset password request with TOKEN {} has EXPIRED",
            resetPasswordRequestEntity.getToken());
        throw new IllegalArgumentException(
            String.format("Reset password request with TOKEN %s has EXPIRED",
                resetPasswordRequestEntity.getToken()));
    }

    private void processValidToken(ResetPasswordRequestEntity resetPasswordRequestEntity) {
        resetPasswordRequestEntity.setStatus(ResetPasswordRequestStatus.ACCEPTED);
        resetPasswordRequestEntity.setResetDate(LocalDateTime.now());
        resetPasswordRequestRepository.save(resetPasswordRequestEntity);
        log.info("Reset password request with TOKEN {} accepted", resetPasswordRequestEntity.getToken());
    }

    @Override
    public void processForgotPasswordRequest(User userRequestedPasswordReset) {
        resetPasswordProcessingService.process(userRequestedPasswordReset);
    }

}
