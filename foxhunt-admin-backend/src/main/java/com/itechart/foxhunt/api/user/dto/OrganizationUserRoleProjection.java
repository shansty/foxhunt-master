package com.itechart.foxhunt.api.user.dto;

import com.itechart.foxhunt.domain.entity.RoleEntity;

public interface OrganizationUserRoleProjection {
    Long getOrganizationId();
    Long getUserId();
    RoleEntity getRoleEntity();
    Boolean getIsActive();

    void setOrganizationId(Long organizationId);
    void setUserId(Long userId);
    void setRoleEntity(RoleEntity roleEntity);
    void setIsActive(Boolean isActive);
}
