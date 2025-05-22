package com.itechart.foxhunt.api.competition.repository;

import com.itechart.foxhunt.api.competition.CompetitionInvitationStatus;
import com.itechart.foxhunt.api.competition.entity.CompetitionInvitationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CompetitionInvitationRepository extends
    JpaRepository<CompetitionInvitationEntity, Long> {

    @Query(value = """
        SELECT ci.* FROM fh_admin.competition_invitation ci
        WHERE ci.competition_id = :competitionId AND ci.participant_id = :participantId
        AND ci.status = :#{#status.name()}
        """, nativeQuery = true)
    Optional<CompetitionInvitationEntity> findByCompetitionAndParticipantAndStatus(
        @Param("competitionId") Long competitionId,
        @Param("participantId") Long participantId,
        @Param("status") CompetitionInvitationStatus status);

    Optional<CompetitionInvitationEntity> findByCompetitionIdAndParticipantId(Long competitionId,
                                                                              Long userId);

    void deleteByCompetitionIdAndParticipantId(Long competitionId,
                                               Long userId);

    @Query(value = "SELECT * FROM fh_admin.competition_invitation ci"
        + " INNER JOIN fh_admin.competition c ON c.competition_id = ci.competition_id"
        + " WHERE c.organization_id = :organization_id AND c.competition_id = :competition_id", nativeQuery = true)
    List<CompetitionInvitationEntity> findAllByCompetitionIdAndOrganizationId(
        @Param("competition_id") Long competitionId,
        @Param("organization_id") Long organizationId);

    @Query(value = "SELECT * FROM fh_admin.competition_invitation ci"
        + " INNER JOIN fh_admin.competition c ON c.competition_id = ci.competition_id"
        + " WHERE c.organization_id = :organization_id AND c.competition_id = :competition_id"
        + " AND ci.participant_id = :user_id", nativeQuery = true)
    List<CompetitionInvitationEntity> findAllByCompetitionIdAndUserIdAndOrganizationId(
        @Param("competition_id") Long competitionId,
        @Param("organization_id") Long organizationId,
        @Param("user_id") Long userId);

    @Query(value = """
        SELECT ci.* FROM fh_admin.competition_invitation ci WHERE participant_id = :participantId
        AND status = :#{#status.name()}
        """, nativeQuery = true)
    List<CompetitionInvitationEntity> findAllByParticipantIdAndStatus(Long participantId,
                                                                      CompetitionInvitationStatus status);

}
