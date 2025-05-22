package com.itechart.foxhunt.api.location.dao;

import com.itechart.foxhunt.domain.entity.location.LocationPackageEntity;
import org.locationtech.jts.geom.Polygon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LocationPackageRepository extends JpaRepository<LocationPackageEntity, Long> {

    @Query(value = "SELECT * FROM location.location_packages WHERE access_type = :accessType", nativeQuery = true)
    List<LocationPackageEntity> findAllPackagesByAccessType(@Param("accessType") String accessType);

    @Modifying
    @Query(value = "DELETE FROM location.location_package_locations lp " +
        "WHERE lp.location_id = :locationId", nativeQuery = true)
    void deleteLocationFromLocationPackages(@Param("locationId") Long locationId);

    @Query(value = "SELECT is_valid FROM location.f_is_within_earth_coordinates(:area)", nativeQuery = true)
    boolean isPackageAreaWithinEarthCoordinates(@Param("area") Polygon packageArea);
}
