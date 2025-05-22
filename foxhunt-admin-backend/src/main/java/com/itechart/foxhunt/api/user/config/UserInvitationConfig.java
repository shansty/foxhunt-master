package com.itechart.foxhunt.api.user.config;

import com.itechart.foxhunt.api.core.ApiConstants;
import com.itechart.foxhunt.api.user.dto.InviteUsersRequest;
import com.itechart.foxhunt.api.user.dto.UserInvitation;
import com.itechart.foxhunt.api.user.email.UnsupportedUserRequestHandler;
import com.itechart.foxhunt.api.user.email.UserRequestHandler;
import com.itechart.foxhunt.api.user.email.invitation.ParticipantInvitationHandler;
import com.itechart.foxhunt.api.user.email.invitation.SupervisorInvitationHandler;
import com.itechart.foxhunt.api.user.email.invitation.TrainerAndParticipantInvitationHandler;
import com.itechart.foxhunt.domain.enums.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;
import java.util.Map;

@Configuration
@RequiredArgsConstructor
public class UserInvitationConfig {

    private final ParticipantInvitationHandler participantInvitationHandler;
    private final SupervisorInvitationHandler supervisorInvitationHandler;
    private final TrainerAndParticipantInvitationHandler trainerAndParticipantInvitationHandler;
    private final UnsupportedUserRequestHandler<InviteUsersRequest, List<UserInvitation>> unsupportedUserRequestHandler;

    @Bean
    public Map<String, UserRequestHandler<InviteUsersRequest, List<UserInvitation>>> userInvitationHandlers() {
        String trainerAndParticipantKey = Role.TRAINER.name() + "_" + Role.PARTICIPANT.name();
        return Map.of(
            Role.PARTICIPANT.name(), participantInvitationHandler,
            Role.TRAINER.name(), supervisorInvitationHandler,
            Role.ORGANIZATION_ADMIN.name(), supervisorInvitationHandler,
            trainerAndParticipantKey, trainerAndParticipantInvitationHandler,
            ApiConstants.ROLE_UNSUPPORTED, unsupportedUserRequestHandler
        );
    }

}
