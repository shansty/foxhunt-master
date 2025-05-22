package com.itechart.foxhunt.api.competition.repository;

import com.itechart.foxhunt.domain.entity.CompetitionParticipantEntity;
import com.itechart.foxhunt.domain.entity.CompetitionParticipantId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface CompetitionParticipantRepository
    extends JpaRepository<CompetitionParticipantEntity, CompetitionParticipantId> {

    Set<CompetitionParticipantEntity> findByCompetitionId(Long id);

    boolean existsByCompetitionIdAndUserId(Long competitionId, Long userId);

    Set<CompetitionParticipantEntity> findByCompetitionIdAndFinishDateIsNull(Long id);

    Set<CompetitionParticipantEntity> getAllByUserId(Long userId);

    void deleteByCompetitionIdAndUserId(Long competitionId, Long userId);

    @Query(nativeQuery = true, value = "SELECT cpa.* " +
        "FROM fh_admin.competition_participant cpa " +
        "JOIN fh_admin.competition c on c.competition_id = cpa.competition_id " +
        "WHERE cpa.user_id = :user_id " +
        "  AND c.organization_id = :organization_id" +
        "  AND c.status = 'FINISHED'")
    Page<CompetitionParticipantEntity> getAllByUserIdAndOrganizationId(Pageable pageable,
                                                                       @Param("user_id") Long userId,
                                                                       @Param("organization_id") Long organizationId);
}
