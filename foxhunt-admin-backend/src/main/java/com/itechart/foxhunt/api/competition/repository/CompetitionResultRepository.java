package com.itechart.foxhunt.api.competition.repository;

import com.itechart.foxhunt.domain.entity.CompetitionResultEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CompetitionResultRepository extends JpaRepository<CompetitionResultEntity, Long> {

    @Query(value = "SELECT CR.*" +
        "   FROM fh_admin.competition_result CR" +
        "   WHERE CR.competition_id = ?1", nativeQuery = true)
    List<CompetitionResultEntity> findByCompetitionId(Long competitionId);
}
