package com.itechart.foxhunt.api.user.mapper;

import com.itechart.foxhunt.api.user.dto.OrganizationUserRole;
import com.itechart.foxhunt.api.user.dto.OrganizationUserRoleProjection;
import com.itechart.foxhunt.api.user.dto.OrganizationUserRoleShortDto;
import com.itechart.foxhunt.domain.entity.OrganizationUserRoleEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(uses = {UserMapper.class})
public interface OrganizationUserRoleMapper {

    @Mapping(target = "organizationId", source = "id.organizationId")
    @Mapping(target = "user", source = "userEntity")
    @Mapping(target = "role", source = "roleEntity")
    OrganizationUserRole entityToDomain(OrganizationUserRoleEntity userRoleEntity);

    @Mapping(target = "organizationId", source = "userRoleProjection.organizationId")
    @Mapping(target = "userId", source = "userRoleProjection.userId")
    @Mapping(target = "role", source = "userRoleProjection.roleEntity.role")
    OrganizationUserRoleShortDto projectionToShortDto(OrganizationUserRoleProjection userRoleProjection);

    @Mapping(target = "organizationId", source = "userRoleEntity.id.organizationId")
    @Mapping(target = "userId", source = "userRoleEntity.id.userId")
    @Mapping(target = "role", source = "userRoleEntity.roleEntity.role")
    @Mapping(target = "isActive", source = "active")
    OrganizationUserRoleShortDto entityToShortDto(OrganizationUserRoleEntity userRoleEntity);

}
