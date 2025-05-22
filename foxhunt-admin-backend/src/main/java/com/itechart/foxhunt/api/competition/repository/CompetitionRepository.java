package com.itechart.foxhunt.api.competition.repository;

import com.itechart.foxhunt.api.competition.dto.GetAllCompetitionsRequest;
import com.itechart.foxhunt.domain.entity.CompetitionEntity;
import com.itechart.foxhunt.domain.enums.CompetitionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompetitionRepository extends PagingAndSortingRepository<CompetitionEntity, Long>,
    JpaSpecificationExecutor<CompetitionEntity> {

    Page<CompetitionEntity> findAllByOrganizationId(Long organizationId, Pageable pageable);

    List<CompetitionEntity> getAllByStatus(CompetitionStatus status);

    Optional<CompetitionEntity> findByIdAndOrganizationId(Long competitionId, Long organizationId);

    Optional<CompetitionEntity> findByIdAndOrganizationIdAndStatus(Long id, Long organizationId, CompetitionStatus status);

    @Query(value = """
        SELECT competition FROM CompetitionEntity competition
        WHERE competition.organizationId = :organizationId AND
        (LOWER(competition.name) LIKE LOWER(CONCAT('%',:#{#request.name},'%'))) AND
        (:#{#request.startDate.day} IS NULL OR (DAY(competition.startDate) = :#{#request.startDate.day})) AND
        (:#{#request.startDate.month} IS NULL OR (MONTH(competition.startDate) = :#{#request.startDate.month})) AND
        (:#{#request.startDate.year} IS NULL OR (YEAR(competition.startDate) = :#{#request.startDate.year})) AND
        competition.status IN :#{#request.statuses}""")
    Page<CompetitionEntity> findAllFiltered(@Param("organizationId") Long organizationId,
                                            @Param("request") GetAllCompetitionsRequest request, Pageable pageable);

    @Query(value = "SELECT * FROM fh_admin.competition c WHERE c.start_date < TIMESTAMP 'today' " +
        "AND c.status = 'SCHEDULED'", nativeQuery = true)
    List<CompetitionEntity> getAllExpiredScheduledCompetitions();

    boolean existsByIdAndOrganizationId(Long competitionId, Long organizationId);

    @Query(value = "SELECT EXISTS (SELECT 1 FROM fh_admin.competition AS c " +
        "WHERE c.organization_id = :organizationId AND c.name = :name)", nativeQuery = true)
    boolean existsByOrganizationAndName(@Param("organizationId") Long organizationId,
                                        @Param("name") String competitionName);
}
