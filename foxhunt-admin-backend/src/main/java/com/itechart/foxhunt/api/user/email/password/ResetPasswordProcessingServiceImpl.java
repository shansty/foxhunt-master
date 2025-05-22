package com.itechart.foxhunt.api.user.email.password;

import com.itechart.foxhunt.api.user.dto.ResetPasswordRequest;
import com.itechart.foxhunt.api.user.dto.User;
import com.itechart.foxhunt.api.user.email.UserRequestProcessingService;
import com.itechart.foxhunt.api.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ResetPasswordProcessingServiceImpl implements UserRequestProcessingService<User, ResetPasswordRequest> {

    private final RegisteredUserResetPasswordHandler registeredUserResetPasswordHandler;
    private final UnregisteredUserResetPasswordHandler unregisteredUserResetPasswordHandler;
    private final UserService userService;

    @Override
    public ResetPasswordRequest process(User userRequestedPasswordReset) {
        ResetPasswordRequestHandler handler = findHandler(userRequestedPasswordReset);
        return handler.handleRequest(userRequestedPasswordReset);
    }

    private ResetPasswordRequestHandler findHandler(User user) {
        String userEmail = user.getEmail();
        if (userService.existsByEmailAndActive(userEmail)) {
            return registeredUserResetPasswordHandler;
        } else {
            return unregisteredUserResetPasswordHandler;
        }
    }

}
