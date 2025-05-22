package com.itechart.foxhunt.api.user.service;

import com.itechart.foxhunt.api.user.dto.OrganizationUserRole;
import com.itechart.foxhunt.api.user.dto.User;
import com.itechart.foxhunt.domain.entity.OrganizationUserRoleEntity;
import com.itechart.foxhunt.domain.enums.Role;

import java.util.List;
import java.util.Set;

public interface OrganizationUserRoleService {

    OrganizationUserRoleEntity addUserToOrganization(Long organizationId, User user, Role role);

    OrganizationUserRoleEntity addUserToOrganization(Long organizationId, User user, Role role, boolean isActive);

    List<OrganizationUserRoleEntity> addUsersToOrganization(Long organizationId, Set<User> users, Set<Role> roles);

    OrganizationUserRoleEntity findOrganizationUserRole(Long organizationId, Long userId, Role role);

    OrganizationUserRole changeOrganizationAdmin(Long organizationId, Long userId);

    Set<OrganizationUserRoleEntity> findAllByOrganizationIdAndUserId(Long organizationId, Long userId);

    void updateActiveStatus(Long organizationId, Long userId, boolean isActive);

    void updateActiveStatus(Long organizationId, Long userId, Role role, boolean isActive);

    Set<OrganizationUserRoleEntity> findAllByOrganizationAndUserEmailsAndActiveStatus(Long organizationId,
                                                                                      Set<String> userEmails,
                                                                                      boolean isActive);

    void deactivateAllRoles(Long organizationId, Long userId);

    void deleteAllRoles(Long organizationId, Long userId);

    void deleteAllRoles(Long userId);

}
