package com.itechart.foxhunt.api.user.dao;

import com.itechart.foxhunt.api.user.dto.UserProjection;
import com.itechart.foxhunt.domain.entity.UserEntity;
import com.itechart.foxhunt.domain.enums.Role;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {

    @Query("SELECT U.id FROM UserEntity U, IN (U.roles) R WHERE U.id IN (:ids) AND R.role = :role")
    List<Long> findByIdsAndRole(@Param("ids") List<Long> ids, @Param("role") Role role);

    Optional<UserEntity> findByEmail(String email);

    Set<UserEntity> findByEmailIn(Set<String> emails);

    @Query(value = "SELECT u.* FROM fh_admin.app_user AS u " +
        "INNER JOIN fh_admin.organization_user_role org ON u.app_user_id = org.user_id " +
        "WHERE org.organization_id = :organization_id AND org.user_id = :user_id", nativeQuery = true)
    Optional<UserEntity> findByIdAndOrganizationId(@Param("user_id") Long userId, @Param("organization_id") Long organizationId);

    @Query(value = "SELECT u.* FROM fh_admin.app_user AS u " +
        "INNER JOIN fh_admin.organization_user_role org ON u.app_user_id = org.user_id " +
        "INNER JOIN fh_admin.role r ON org.role_id = r.role_id " +
        "WHERE org.organization_id = :organization_id AND r.role = :role", nativeQuery = true)
    Optional<UserEntity> findByRoleNameAndOrganizationId(@Param("role") String role, @Param("organization_id") Long organizationId);

    Boolean existsByEmailAndIsActivated(String email, boolean isActivated);

    @Query(value = " SELECT DISTINCT(u.*) FROM fh_admin.app_user u" +
        " INNER JOIN fh_admin.organization_user_role our ON u.app_user_id  = our.user_id" +
        " WHERE u.email = :email AND our.is_active = true AND our.organization_id = :organizationId" +
        " AND u.is_activated = true;",
        nativeQuery = true)
    Optional<UserEntity> findActiveByEmailAndOrganizationId(@Param("email") String email,
                                                            @Param("organizationId") Long organizationId);

    Optional<UserEntity> findByEmailAndIsActivated(String email, boolean isActivated);

    @Query(value = "SELECT DISTINCT user.id AS id, user.firstName AS firstName, user.lastName AS lastName, " +
        "user.dateOfBirth AS dateOfBirth, " +
        "user.country AS country, user.city AS city, user.email AS email, user.isActivated AS isActivated, " +
        "user.activatedSince AS activatedSince, user.avatar AS avatar " +
        "FROM UserEntity user " +
        "INNER JOIN OrganizationUserRoleEntity userRole ON userRole.userEntity = user " +
        "WHERE userRole.id.organizationId = :organizationId AND userRole.roleEntity.role IN (:roles) " +
        "AND (:isActive IS NULL OR user.isActivated = :isActive)")
    List<UserProjection> findAllByOrganizationId(@Param("organizationId") Long organizationId,
                                                 @Param("roles") List<Role> roles,
                                                 @Param("isActive") Boolean isActive,
                                                 Pageable pageable);


    @Query(value = "SELECT count(DISTINCT app_user_id) FROM fh_admin.app_user u " +
        " INNER JOIN fh_admin.organization_user_role our ON u.app_user_id  = our.user_id " +
        " WHERE organization_id = :organization_id", nativeQuery = true)
    long countAllByOrganizationId(@Param("organization_id") Long organizationId);

    @Query(value = "SELECT * FROM fh_admin.app_user u" +
        " INNER JOIN fh_admin.organization_user_role our ON u.app_user_id = our.user_id " +
        " WHERE role_id = :role_id AND organization_id = :organization_id " +
        " AND user_id = :user_id"
        , nativeQuery = true)
    Optional<UserEntity> findByIdAndRoleIdWithinOrganizationWithId(@Param("user_id") Long userId,
                                                                   @Param("role_id") Long roleId,
                                                                   @Param("organization_id") Long organizationId);

    @Query(value = "SELECT u.app_user_id FROM fh_admin.app_user u WHERE u.email = :email", nativeQuery = true)
    Optional<Long> findIdByEmail(@Param("email") String email);
}

