package com.itechart.foxhunt.api.user;

import com.itechart.foxhunt.api.user.dto.User;
import com.itechart.foxhunt.api.user.entity.ResetPasswordRequestEntity;

public interface PasswordService {

    void processForgotPasswordRequest(User user);

    ResetPasswordRequestEntity processResetPasswordRequest(String token);

}
