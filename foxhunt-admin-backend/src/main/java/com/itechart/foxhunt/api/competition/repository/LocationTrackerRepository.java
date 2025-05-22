package com.itechart.foxhunt.api.competition.repository;

import com.itechart.foxhunt.api.competition.dto.ActiveTracker;
import com.itechart.foxhunt.api.competition.dto.ActiveTrackerProjection;
import com.itechart.foxhunt.domain.entity.LocationTrackerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LocationTrackerRepository extends JpaRepository<LocationTrackerEntity, Long> {

    List<LocationTrackerEntity> findAllByCompetitionId(Long competitionId);

    @Query("SELECT new com.itechart.foxhunt.api.competition.dto.ActiveTracker(l.participant.id, p.gameTime, p.currentPlace, p.isDisconnected) " +
        "FROM LocationTrackerEntity l INNER JOIN PathStoryEntity p ON l.id = p.locationTrackerEntity.id WHERE l.competition.id = ?1")
    List<ActiveTracker> findTrackersByCompetitionId(Long competitionId);

    @Query("SELECT new com.itechart.foxhunt.api.competition.dto.ActiveTracker(l.participant.id, p.gameTime, p.currentPlace, p.isDisconnected) " +
        "FROM LocationTrackerEntity l INNER JOIN PathStoryEntity p ON l.id = p.locationTrackerEntity.id WHERE l" +
        ".competition.id = ?1 AND p.rank <= ?2")
    List<ActiveTracker> findTrackersByCompetitionId(Long competitionId, long lastTrackerQuantity);

    @Query("SELECT l.participant.id AS participantId, p.gameTime AS gameTime, p.currentPlace AS currentLocation, p AS pathStory, " +
        "p.isDisconnected AS isDisconnected " +
        "FROM LocationTrackerEntity l INNER JOIN PathStoryEntity p ON l.id = p.locationTrackerEntity.id WHERE l" +
        ".competition.id = ?1 AND l.participant.id = ?2 AND  p.rank <=?3 AND p.rank >?4 " +
        "ORDER BY p.rank asc")
    List<ActiveTrackerProjection> findTrackersByCompetitionIdAndParticipantIds(Long competitionId, Long participantId,
                                                                               long startPosition, long endPosition);

    @Query("SELECT count(p.id)" +
        "FROM LocationTrackerEntity l INNER JOIN PathStoryEntity p ON l.id = p.locationTrackerEntity.id WHERE l" +
        ".competition.id = ?1 AND l.participant.id = ?2 ")
    Long countTrackersByCompetitionIdAndParticipantIds(Long competitionId, Long participantId);

    @Query("SELECT  l " +
        "FROM LocationTrackerEntity l " +
        "WHERE l.competition.id = ?1 and l.participant.id = ?2")
    LocationTrackerEntity findTrackerIdByCompetitionIdAndUserId(Long competitionId, Long participantId);

}

