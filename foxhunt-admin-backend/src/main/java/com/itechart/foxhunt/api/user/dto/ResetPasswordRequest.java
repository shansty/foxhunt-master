package com.itechart.foxhunt.api.user.dto;

import com.itechart.foxhunt.api.user.ResetPasswordRequestStatus;
import com.itechart.foxhunt.domain.entity.EmailTemplateEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResetPasswordRequest {

    private Long resetPasswordRequestId;

    private LocalDateTime requestDate;

    private LocalDateTime expirationDate;

    private LocalDateTime resetDate;

    private String token;

    private ResetPasswordRequestStatus status;

    private User user;

    private boolean isUserExisted;

    private EmailTemplateEntity emailTemplateEntity;

}
