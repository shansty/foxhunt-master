package com.itechart.foxhunt.api.competition.repository;

import com.itechart.foxhunt.api.competition.entity.SingleParticipantCompetitionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SingleParticipantCompetitionRepository extends
    JpaRepository<SingleParticipantCompetitionEntity, Long> {

    @Query(value = "SELECT * from fh_admin.single_participant_competition"
        + " WHERE competition -> 'participants' -> 0 -> 'id' = :user_id\\:\\:jsonb", nativeQuery = true)
    List<SingleParticipantCompetitionEntity> findAllByUserId(@Param("user_id") String userId);
}
