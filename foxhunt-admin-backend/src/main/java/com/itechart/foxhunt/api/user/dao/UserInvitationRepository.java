package com.itechart.foxhunt.api.user.dao;

import com.itechart.foxhunt.domain.entity.UserEntity;
import com.itechart.foxhunt.domain.entity.UserInvitationEntity;
import com.itechart.foxhunt.domain.enums.UserInvitationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface UserInvitationRepository extends JpaRepository<UserInvitationEntity, Long>,
    JpaSpecificationExecutor<UserInvitationEntity> {

    Optional<UserInvitationEntity> findByTokenAndStatus(String token, UserInvitationStatus status);

    Optional<UserInvitationEntity> findByTokenAndStatusInAndOrganizationId(String token,
                                                                           List<UserInvitationStatus> invitationStatuses,
                                                                           Long organizationId);

    @Query(value = "SELECT EXISTS (SELECT 1 FROM fh_admin.user_invitation ui " +
        "WHERE organization_id = :organizationId AND user_id = :userId " +
        "AND ui.status = cast(:#{#status.name()} AS fh_admin.user_invitation_status))",
        nativeQuery = true)
    boolean existsByOrganizationAndUserAndStatus(@Param("organizationId") Long organizationId,
                                                 @Param("userId") Long userId,
                                                 @Param("status") UserInvitationStatus status);

    @Modifying
    @Query(value = "UPDATE fh_admin.user_invitation AS ui SET status = 'EXPIRED' " +
        "WHERE end_date < CURRENT_TIMESTAMP AND ui.status = 'NEW' ", nativeQuery = true)
    int markInvitationsAsExpired();

    Set<UserInvitationEntity> findByUserEntityAndStatus(UserEntity userEntity, UserInvitationStatus status);
}
