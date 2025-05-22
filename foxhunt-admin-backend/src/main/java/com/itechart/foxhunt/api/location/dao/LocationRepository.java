package com.itechart.foxhunt.api.location.dao;

import com.itechart.foxhunt.domain.entity.location.LocationEntity;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.Polygon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LocationRepository extends JpaRepository<LocationEntity, Long> {

    Optional<LocationEntity> findByName(String name);

    @Query(value = "SELECT ST_Equals(coordinates, :area) FROM location.locations " +
        "WHERE location_id = :id", nativeQuery = true)
    boolean isAreaMatchesToLocation(@Param("id") Long id, @Param("area") Polygon area);

    @Query(value = "SELECT ST_AsText((ST_Dump(ST_GeneratePoints(:area, :pointQuantity))).geom)", nativeQuery = true)
    List<String> getRandomCoordinatesFromArea(@Param("area") Polygon area,
                                              @Param("pointQuantity") Integer pointQuantity);

    @Query(value = "SELECT ST_AsText((ST_Project( :point\\:\\:geography, :distance, radians(:degrees) )))", nativeQuery = true)
    String getProjectedPoint(@Param("point") Point point, @Param("distance") Float distance, @Param("degrees") Float degrees);

    @Query(value = "SELECT is_valid FROM location.f_is_within_earth_coordinates(:area)", nativeQuery = true)
    boolean isAreaWithinEarthCoordinates(@Param("area") Polygon locationArea);
}
