package com.itechart.foxhunt.api.competition.repository;

import com.itechart.foxhunt.domain.entity.FoxPointEntity;
import org.locationtech.jts.geom.Point;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoxPointRepository  extends JpaRepository<FoxPointEntity, Long> {


    @Query(value = "SELECT fp.fox_point_id,fp.index, fp.label,fp.competition_id,fp.coordinates, fp.frequency " +
        " FROM fh_admin.competition cmp" +
        " INNER JOIN fh_admin.fox_point fp on cmp.competition_id = fp.competition_id " +
        " WHERE cmp.competition_id = ?1  AND" +
        " ST_Distance (fp.coordinates ," +
        " ?2 ," +
        " false) < ?3" +
        " AND fp.fox_point_id NOT IN(select cr.fox_point_id " +
        "                  FROM fh_admin.competition_result cr" +
        "                  WHERE cr.user_id = ?4)", nativeQuery = true)
    List<FoxPointEntity> findNotVisitedPointsInRadiusForCompetition(Long competitionId, Point point, Double radius, Long userId);
}
