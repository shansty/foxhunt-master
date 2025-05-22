package com.itechart.foxhunt.api.auth;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.itechart.foxhunt.api.auth.security.AuthenticationInfo;
import com.itechart.foxhunt.api.auth.security.UserAuthentication;
import com.itechart.foxhunt.api.exception.globalhandler.ErrorResponse;
import com.itechart.foxhunt.domain.enums.Role;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.ConstraintViolation;
import javax.validation.Validator;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class SecurityFilter extends OncePerRequestFilter {

    private final ObjectMapper objectMapper;

    private final Validator validator;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws IOException {
        try {
            processAuthenticationHeader(request);
            filterChain.doFilter(request, response);
        } catch (Exception e) {
            sendErrorAsJson(response, e);
        }
    }

    private void processAuthenticationHeader(HttpServletRequest request) {
        AuthenticationInfo authenticationInfo = getAuthenticationDataFromRequest(request);
        Map<String, String> validationErrors = validateAuthenticationInfo(authenticationInfo);

        if (validationErrors.isEmpty()) {
            UserAuthentication userAuthentication = buildUserAuthentication(authenticationInfo);
            SecurityContextHolder.getContext().setAuthentication(userAuthentication);
        } else {
            throw new IllegalArgumentException("Payload Header validation error: " + validationErrors);
        }
    }

    private AuthenticationInfo getAuthenticationDataFromRequest(HttpServletRequest request) {
        try {
            String payloadHeader = request.getHeader("payload");
            return objectMapper.readValue(payloadHeader, AuthenticationInfo.class);
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("Payload Header can't be parsed - invalid format");
        }
    }

    private Map<String, String> validateAuthenticationInfo(AuthenticationInfo authenticationInfo) {
        return validator.validate(authenticationInfo).stream()
            .filter(violation -> {
                boolean isOrgIdViolation = violation.getPropertyPath().toString().equals("organizationId");
                boolean isCommonUserAuthentication = !authenticationInfo.getRoles().contains(Role.SYSTEM_ADMIN);
                return isOrgIdViolation && isCommonUserAuthentication;
            })
            .collect(Collectors.toMap(
                violation -> violation.getPropertyPath().toString(), ConstraintViolation::getMessage)
            );
    }

    private UserAuthentication buildUserAuthentication(AuthenticationInfo authenticationInfo) {
        Set<GrantedAuthority> userAuthorities = authenticationInfo.getRoles().stream()
            .map(role -> new SimpleGrantedAuthority(role.getRoleString()))
            .collect(Collectors.toSet());
        return new UserAuthentication(authenticationInfo.getEmail(), authenticationInfo.getOrganizationId(), userAuthorities);
    }

    private void sendErrorAsJson(HttpServletResponse response, Exception e) throws IOException {
        log.error("Error during authentication: ", e);
        ErrorResponse error = ErrorResponse.builder()
            .message(e.getMessage())
            .timestamp(LocalDateTime.now())
            .status(HttpStatus.UNAUTHORIZED.value())
            .build();
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType(MediaType.APPLICATION_JSON.toString());
        response.getWriter().write(objectMapper.writeValueAsString(error));
        response.getWriter().flush();
        response.getWriter().close();
    }
}
