package com.itechart.foxhunt.api.competition.repository;

import com.itechart.foxhunt.domain.entity.PathStoryEntity;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PathStoryRepository extends JpaRepository<PathStoryEntity, Long> {

    @EntityGraph(attributePaths = { "listenableFox" })
    Optional<PathStoryEntity> findTopByLocationTrackerEntity_Competition_IdAndLocationTrackerEntity_Participant_IdOrderByGameTimeDesc(
            Long competitionId, Long participantId);

    default Optional<PathStoryEntity> findLastPathStoryRecordByCompetitionIdAndParticipantId(Long competitionId,
            Long participantId) {
        return findTopByLocationTrackerEntity_Competition_IdAndLocationTrackerEntity_Participant_IdOrderByGameTimeDesc(
                competitionId, participantId);
    }
}