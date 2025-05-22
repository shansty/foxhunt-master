package com.itechart.foxhunt.api.auth.security;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.itechart.foxhunt.api.auth.security.AuthenticationInfo;
import com.itechart.foxhunt.api.auth.security.UserAuthentication;
import com.itechart.foxhunt.api.exception.BadRequestException;
import com.itechart.foxhunt.api.user.dao.SystemAdminRepository;
import com.itechart.foxhunt.api.user.dto.User;
import com.itechart.foxhunt.api.user.mapper.UserMapper;
import com.itechart.foxhunt.domain.enums.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthenticationInfoService {

    private final UserMapper userMapper;

    private final ObjectMapper jsonMapper;

    private final SystemAdminRepository systemAdminRepository;

    public String getLoggedUserAuthHeader() {
        AuthenticationInfo loggedUserAuthenticationInfo = getLoggedUserAuthenticationInfo();
        try {
            return jsonMapper.writeValueAsString(loggedUserAuthenticationInfo);
        } catch (JsonProcessingException e) {
            throw new BadRequestException("Failed to serialize logged user authentication info");
        }
    }

    public AuthenticationInfo getLoggedUserAuthenticationInfo() {
        UserAuthentication authentication = (UserAuthentication) SecurityContextHolder.getContext().getAuthentication();
        Set<Role> userRoles = userMapper.authoritiesToRoles(authentication.getAuthorities());
        return AuthenticationInfo.builder()
            .email(authentication.getEmail())
            .organizationId(authentication.getOrganizationId())
            .roles(userRoles)
            .build();
    }

    @Cacheable(cacheNames = "systemAdminAuthHeader", key = "#root.methodName")
    public String getSystemAdminAuthHeader() {
        AuthenticationInfo systemAdminAuthInfo = getSystemAdminAuthenticationInfo();
        try {
            return jsonMapper.writeValueAsString(systemAdminAuthInfo);
        } catch (JsonProcessingException e) {
            throw new BadRequestException("Failed to serialize system admin authentication info");
        }
    }

    @Cacheable(cacheNames = "systemAdminAuthInfo", key = "#root.methodName")
    public AuthenticationInfo getSystemAdminAuthenticationInfo() {
        return AuthenticationInfo.builder()
            .email(systemAdminRepository.getSystemAdminEmail())
            .roles(Set.of(Role.SYSTEM_ADMIN))
            .build();
    }

    public AuthenticationInfo buildAuthInfo(Long organizationId, User user) {
        AuthenticationInfo authInfo = userMapper.convertToAuthInfo(user);
        authInfo.setOrganizationId(organizationId);
        return authInfo;
    }

    public String buildAuthHeader(Long organizationId, User user) {
        try {
            AuthenticationInfo authInfo = buildAuthInfo(organizationId, user);
            return jsonMapper.writeValueAsString(authInfo);
        } catch (JsonProcessingException e) {
            throw new BadRequestException("Failed to serialize authentication info");
        }
    }

}
