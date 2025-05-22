package com.itechart.foxhunt.api.user.dao;

import com.itechart.foxhunt.api.user.dto.OrganizationUserRoleProjection;
import com.itechart.foxhunt.domain.entity.OrganizationUserRoleEntity;
import com.itechart.foxhunt.domain.entity.OrganizationUserRoleEntityPK;
import com.itechart.foxhunt.domain.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.Set;

//TODO: create common find-method, that will use specification
public interface OrganizationUserRoleRepository extends
    JpaRepository<OrganizationUserRoleEntity, OrganizationUserRoleEntityPK> {

    @Query(value = """
        SELECT * FROM fh_admin.organization_user_role our
        INNER JOIN fh_admin.role r ON our.role_id = r.role_id
        WHERE our.organization_id = :organization_id AND our.user_id = :user_id""", nativeQuery = true)
    Set<OrganizationUserRoleEntity> findAllByOrganizationIdAndUserId(@Param("organization_id") Long organizationId,
                                                                     @Param("user_id") Long userId);

    @Query("SELECT userRole.id.organizationId AS organizationId," +
        "userRole.userEntity.id AS userId, userRole.isActive AS isActive, userRole.roleEntity AS roleEntity " +
        "FROM OrganizationUserRoleEntity userRole " +
        "WHERE userRole.id.organizationId = :organizationId AND userRole.userEntity.id IN (:userIds)" +
        "AND userRole.roleEntity.role IN (:roles)")
    List<OrganizationUserRoleProjection> findAllByOrganizationAndUsersAndRoles(@Param("organizationId") Long organizationId,
                                                                       @Param("userIds") List<Long> userIds, @Param("roles") List<Role> roles);

    @Query(value = "SELECT our.* FROM fh_admin.organization_user_role AS our " +
        "INNER JOIN fh_admin.role AS role ON role.role_id = our.role_id " +
        "WHERE organization_id = :organizationId AND user_id = :userId " +
        "AND role.role = :#{#role.name()}", nativeQuery = true)
    Optional<OrganizationUserRoleEntity> findByOrganizationAndUserAndRole(@Param("organizationId") Long organizationId,
                                                                          @Param("userId") Long userId,
                                                                          @Param("role") Role role);

    @Query(value = "SELECT our.* FROM fh_admin.organization_user_role AS our " +
        "INNER JOIN fh_admin.role AS role ON role.role_id = our.role_id " +
        "WHERE our.organization_id = :organizationId AND role.role = :#{#role.name()} ", nativeQuery = true)
    Optional<OrganizationUserRoleEntity> findByOrganizationAndRole(@Param("organizationId") Long organizationId,
                                                                   @Param("role") Role role);

    @Query(value = "SELECT our.* FROM fh_admin.organization_user_role AS our " +
        "WHERE user_id = :userId", nativeQuery = true)
    List<OrganizationUserRoleEntity> findAllByUserId(@Param("userId") Long userId);

    @Query(value = "SELECT * FROM fh_admin.organization_user_role our " +
        "INNER JOIN fh_admin.app_user u ON our.user_id = u.app_user_id " +
        "WHERE our.organization_id = :organizationId AND our.is_active = :isActive " +
        "AND u.email IN (:userEmails)", nativeQuery = true)
    Set<OrganizationUserRoleEntity> findAllByOrganizationAndUserEmailsAndActiveStatus(@Param("organizationId") Long organizationId,
                                                                                      @Param("userEmails") Set<String> userEmails,
                                                                                      @Param("isActive") boolean isActive);

}


