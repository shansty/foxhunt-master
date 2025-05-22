package com.itechart.foxhunt.api.user.email.invitation;

import com.github.jknack.handlebars.internal.lang3.StringUtils;
import com.itechart.foxhunt.api.core.ApiConstants;
import com.itechart.foxhunt.api.user.dto.InviteUsersRequest;
import com.itechart.foxhunt.api.user.dto.UserInvitation;
import com.itechart.foxhunt.api.user.email.UserRequestHandler;
import com.itechart.foxhunt.api.user.email.UserRequestProcessingService;
import com.itechart.foxhunt.domain.enums.Role;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class InvitationProcessingServiceImpl implements UserRequestProcessingService<InviteUsersRequest, List<UserInvitation>> {

    @Qualifier("userInvitationHandlers")
    private final Map<String, UserRequestHandler<InviteUsersRequest, List<UserInvitation>>> userInvitationHandlers;

    @Override
    public List<UserInvitation> process(InviteUsersRequest inviteRequest) {
        UserRequestHandler<InviteUsersRequest, List<UserInvitation>> handler = findHandler(inviteRequest.getRoles());
        return handler.handleRequest(inviteRequest);
    }

    private UserRequestHandler<InviteUsersRequest, List<UserInvitation>> findHandler(Set<Role> roles) {
        List<Role> sortedRoles = roles.stream().sorted().toList();
        String handlerKey = StringUtils.join(sortedRoles, "_");
        UserRequestHandler<InviteUsersRequest, List<UserInvitation>> handler = userInvitationHandlers.get(handlerKey);

        if (handler == null) {
            log.info("Received request with unsupported invitation roles: {}", handlerKey);
            return userInvitationHandlers.get(ApiConstants.ROLE_UNSUPPORTED);
        }

        return handler;
    }

}
