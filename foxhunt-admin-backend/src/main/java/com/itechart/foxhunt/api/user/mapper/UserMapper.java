package com.itechart.foxhunt.api.user.mapper;

import com.itechart.foxhunt.api.auth.security.AuthenticationInfo;
import com.itechart.foxhunt.api.location.dto.UserShortDto;
import com.itechart.foxhunt.api.user.dto.*;
import com.itechart.foxhunt.api.user.entity.SystemAdminEntity;
import com.itechart.foxhunt.domain.entity.UserEntity;
import com.itechart.foxhunt.domain.enums.Role;
import org.mapstruct.*;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE,
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface UserMapper {

    UserEntity domainToEntity(User user);

    User entityToDomain(UserEntity userEntity);

    SystemAdmin entityToDomain(SystemAdminEntity systemAdminEntity);

    @Mapping(target = "activated", source = "isActivated")
    User projectionToDomain(UserProjection userProjection);

    @Mapping(target = "userId", source = "id")
    UserShortDto convertToShortDto(User user);

    AuthenticationInfo convertToAuthInfo(User user);

    UserEntity mergeDomainToEntity(@MappingTarget UserEntity userEntity, RegistrationUserInfo registrationUserInfo);

    default Set<Role> organizationUserRolesToRoles(Set<OrganizationUserRoleShortDto> userRoles) {
        return userRoles.stream()
            .map(OrganizationUserRoleShortDto::getRole)
            .collect(Collectors.toSet());
    }

    default Set<Role> authoritiesToRoles(Collection<? extends GrantedAuthority> authorities) {
        return authorities.stream()
            .map(Role::authorityToRole)
            .collect(Collectors.toSet());
    }
}
