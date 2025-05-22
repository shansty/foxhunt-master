package com.itechart.foxhunt.api.user.service.validator;

import com.itechart.foxhunt.api.exception.BadRequestException;
import com.itechart.foxhunt.api.exception.UserNotRegisteredException;
import com.itechart.foxhunt.api.user.dto.OrganizationUserRoleShortDto;
import com.itechart.foxhunt.api.user.dto.User;
import com.itechart.foxhunt.domain.enums.Role;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.Map;
import java.util.Set;

import static java.util.Objects.isNull;
import static java.util.Objects.nonNull;
import static java.util.stream.Collectors.toSet;

@Component
@Slf4j
public class UserValidator {

    private static final Map<Role, Set<Role>> UPDATING_PERMISSIONS = Map.of(
        Role.ORGANIZATION_ADMIN, Set.of(Role.TRAINER, Role.PARTICIPANT),
        Role.TRAINER, Set.of(Role.PARTICIPANT)
    );

    public void validateUpdatingActiveStatus(User initiatedUser, User updatedUser) {
        validateActivatedSince(updatedUser.getActivatedSince());
        validateSelfMadeChange(initiatedUser.getId(), updatedUser.getId());
        validatePermissionsToUpdateOtherUsers(initiatedUser, updatedUser);
    }

    private void validateActivatedSince(LocalDateTime activatedSince) {
        if (isNull(activatedSince)) {
            String msg = "User hasn't completed registration.";
            log.warn(msg);
            throw new UserNotRegisteredException(msg);
        }
    }

    private void validateSelfMadeChange(Long initiatedUserId, Long updatedUserId) {
        if (initiatedUserId.equals(updatedUserId)) {
            throwAccessDeniedException("User can't update active status for himself.");
        }
    }

    public void validatePermissionsToUpdateOtherUsers(User initiatedUser, User updatedUser) {
        Set<Role> initiatedUserRoles = retrieveRoles(initiatedUser);
        Set<Role> updatedUserRoles = retrieveRoles(updatedUser);
        Set<Role> permittedToUpdateRoles = retrieveAvailableToUpdateRoles(initiatedUserRoles);
        boolean hasPermission = nonNull(permittedToUpdateRoles) &&
            CollectionUtils.isNotEmpty(updatedUserRoles) && permittedToUpdateRoles.containsAll(updatedUserRoles);
        if (!hasPermission) {
            throwAccessDeniedException("User doesn't have permissions to update active status in organization.");
        }
    }

    private Set<Role> retrieveRoles(User user) {
        return user.getRoles().stream()
            .map(OrganizationUserRoleShortDto::getRole)
            .collect(toSet());
    }

    private Set<Role> retrieveAvailableToUpdateRoles(Set<Role> roles) {
        Role mostImportantRole = roles.stream()
            .min(Comparator.comparing(Role::ordinal))
            .orElseThrow(() -> new BadRequestException("User doesn't have roles."));
        return UPDATING_PERMISSIONS.get(mostImportantRole);
    }

    private void throwAccessDeniedException(String msg) {
        log.warn(msg);
        throw new AccessDeniedException(msg);
    }

}
