package com.itechart.foxhunt.api.auth.security;

import com.itechart.foxhunt.api.user.dto.OrganizationUserRoleShortDto;
import com.itechart.foxhunt.api.user.dto.User;
import com.itechart.foxhunt.api.user.mapper.UserMapper;
import com.itechart.foxhunt.api.user.service.UserService;
import com.itechart.foxhunt.domain.entity.UserEntity;
import com.itechart.foxhunt.domain.enums.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class LoggedUserService {

    private final UserService userService;

    private final UserMapper userMapper;

    private final AuthenticationInfoService authInfoService;

    public Long getLoggedUserId() {
        String loggedUserEmail = getLoggedUserEmail();
        return userService.getIdByEmail(loggedUserEmail);
    }

    public String getLoggedUserEmail() {
        return authInfoService.getLoggedUserAuthenticationInfo().getEmail();
    }

    public Long getLoggedUserOrganizationId() {
        return authInfoService.getLoggedUserAuthenticationInfo().getOrganizationId();
    }

    public User getLoggedUser() {
        AuthenticationInfo authInfo = authInfoService.getLoggedUserAuthenticationInfo();
        return userService.findActiveUserInOrganization(authInfo.getEmail(), authInfo.getOrganizationId());
    }

    public UserEntity getLoggedUserEntity() {
        UserAuthentication authentication = (UserAuthentication) SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userService.findActiveUserInOrganization(authentication.getEmail(), authentication.getOrganizationId());
        return userMapper.domainToEntity(loggedUser);
    }

    public Set<Role> retrieveLoggedUserRoles() {
        return getLoggedUser().getRoles().stream()
            .map(OrganizationUserRoleShortDto::getRole)
            .collect(Collectors.toSet());
    }

}
