package com.itechart.foxhunt.api.auth.security;

import com.itechart.foxhunt.api.auth.AuthenticationRequest;
import com.itechart.foxhunt.api.auth.GoogleAuthenticationRequest;
import com.itechart.foxhunt.api.auth.SystemAdminAuthenticationRequest;
import com.itechart.foxhunt.api.exception.BadRequestException;
import com.itechart.foxhunt.api.organization.ChangeOrganizationRequest;
import com.itechart.foxhunt.api.organization.OrganizationService;
import com.itechart.foxhunt.api.user.dto.OrganizationUserRoleShortDto;
import com.itechart.foxhunt.api.user.dto.SystemAdmin;
import com.itechart.foxhunt.api.user.dto.User;
import com.itechart.foxhunt.api.user.service.UserInvitationService;
import com.itechart.foxhunt.api.user.service.UserService;
import com.itechart.foxhunt.domain.enums.Role;
import com.itechart.foxhunt.domain.enums.UserInvitationStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import javax.persistence.EntityNotFoundException;
import java.util.Set;
import java.util.function.Supplier;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
@Slf4j
public class AuthorizationService {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final OrganizationService organizationService;

    private final UserInvitationService userInvitationService;

    public AuthenticationInfo validateAuthenticationRequest(AuthenticationRequest request) {
        return handleAuthentication(() -> {
            String email = request.getEmail();
            log.info("Email is ", email)
            Long organizationId = organizationService.getOrganizationIdByDomain(request.getDomain());
            log.info("OrganizationID is ", organizationId)
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, request.getPassword()));
            User activeUser = userService.findActiveUserInOrganization(email, organizationId);
            return new AuthenticationInfo(activeUser.getEmail(), organizationId, getRoles(activeUser));
        });
    }

    public AuthenticationInfo handleGoogleAuthenticationRequest(GoogleAuthenticationRequest request) {
        String email = request.getEmail();
        Long organizationId = organizationService.getOrganizationIdByDomain(request.getDomain());
        return handleAuthentication(() -> {
            boolean isUserActivated = userService.existsByEmailAndActive(email);
            User userToAuthenticate = isUserActivated ?
                userService.findActiveUserInOrganization(email, organizationId) :
                userService.findInactiveUserByEmail(email);
            if (!isUserActivated) {
                log.info("User {} is not active in organization {}, attempting to activate", email, organizationId);
                userInvitationService
                    .checkInvitationExistence(organizationId, userToAuthenticate.getId(), UserInvitationStatus.ACCEPTED);
                userToAuthenticate.setFirstName(request.getFirstName());
                userToAuthenticate.setLastName(request.getLastName());
                userService.activate(userToAuthenticate);
            }
            return new AuthenticationInfo(userToAuthenticate.getEmail(), organizationId, getRoles(userToAuthenticate));
        });
    }

    public AuthenticationInfo validateSystemAdminAuthenticationRequest(SystemAdminAuthenticationRequest request) {
        return handleAuthentication(() -> {
            String email = request.getEmail();
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, request.getPassword()));
            SystemAdmin systemAdmin = userService.findSystemAdminByEmail(email);
            return new AuthenticationInfo(systemAdmin.getEmail(), null, Set.of(Role.SYSTEM_ADMIN));
        });
    }

    private AuthenticationInfo handleAuthentication(Supplier<AuthenticationInfo> request) {
        try {
            return request.get();
        } catch (InternalAuthenticationServiceException e) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, e.getMessage());
        }  catch (BadCredentialsException | EntityNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password", e);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unable to authenticate user", e);
        }
    }

    public AuthenticationInfo changeOrganization(ChangeOrganizationRequest request, String loggedUserEmail) {
        Long organizationId = organizationService.getOrganizationIdByDomain(request.getDomain());
        User userToChangeOrganization = userService.findActiveUserInOrganization(loggedUserEmail, organizationId);
        checkUserAccessPermissions(userToChangeOrganization);
        return new AuthenticationInfo(loggedUserEmail, organizationId, getRoles(userToChangeOrganization));
    }

    private void checkUserAccessPermissions(User user) {
        Set<Role> allowedRoles = Set.of(Role.TRAINER, Role.ORGANIZATION_ADMIN, Role.SYSTEM_ADMIN);
        boolean isUserHaveAccess = getRoles(user).stream().anyMatch(allowedRoles::contains);
        if (!isUserHaveAccess) {
            throw new BadRequestException("You don't have admin rights in the provided organization");
        }
    }

    private Set<Role> getRoles(User user) {
        return user.getRoles().stream().map(OrganizationUserRoleShortDto::getRole).collect(Collectors.toSet());
    }
}
