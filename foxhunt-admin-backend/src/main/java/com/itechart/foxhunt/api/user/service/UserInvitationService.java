package com.itechart.foxhunt.api.user.service;

import com.itechart.foxhunt.api.user.dto.InvitationDeclineReason;
import com.itechart.foxhunt.api.user.dto.InviteUsersRequest;
import com.itechart.foxhunt.api.user.dto.User;
import com.itechart.foxhunt.api.user.dto.UserInvitation;
import com.itechart.foxhunt.domain.enums.Role;
import com.itechart.foxhunt.domain.enums.UserInvitationStatus;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Set;

public interface UserInvitationService {

    List<UserInvitation> getAll(Pageable pageable);

    UserInvitation processUserResponseOnInvitation(String orgDomain, String token, UserInvitationStatus status);

    List<UserInvitation> inviteUsers(Long organizationId, InviteUsersRequest inviteRequest);

    void inviteDeactivatedUser(User initiatedUser, Long reactivatedUserId, Long organizationId, Set<Role> roles);

    UserInvitation resendInvitation(Long userInvitationId);

    void declineInvitation(Long invitationId);

    InvitationDeclineReason setDeclineReason(String invitationToken, InvitationDeclineReason declineReason);

    void checkInvitationExistence(Long organizationId, Long userId, UserInvitationStatus status);

}
