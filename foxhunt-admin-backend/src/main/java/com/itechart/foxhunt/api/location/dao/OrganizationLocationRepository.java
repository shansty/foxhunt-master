package com.itechart.foxhunt.api.location.dao;

import com.itechart.foxhunt.domain.entity.OrganizationLocationCompositePK;
import com.itechart.foxhunt.domain.entity.OrganizationLocationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface OrganizationLocationRepository extends
    JpaRepository<OrganizationLocationEntity, OrganizationLocationCompositePK> {

    @Modifying
    @Query(value = "DELETE FROM location.organization_locations ol "
        + " WHERE  ol.location_id = :location_id", nativeQuery = true)
    void deleteByLocationId(@Param("location_id") Long id);

    @Query(value = "SELECT EXISTS (SELECT 1 FROM location.organization_locations AS ol " +
        "INNER JOIN location.locations AS l ON ol.location_id = l.location_id " +
        "WHERE ol.organization_id = :organizationId AND l.name = :name)", nativeQuery = true)
    boolean existsByOrganizationAnLocationName(@Param("organizationId") Long organizationId,
                                               @Param("name") String locationName);

    @Modifying
    @Query(value = """
        INSERT INTO location.organization_favorite_locations(organization_id, location_id)
        VALUES (:organizationId, :locationId)""", nativeQuery = true)
    void addLocationToFavorite(@Param("organizationId") Long organizationId, @Param("locationId") Long locationId);

    @Modifying
    @Query(value = """
        DELETE FROM location.organization_favorite_locations
        WHERE organization_id = :organizationId AND location_id = :locationId""", nativeQuery = true)
    void removeLocationFromFavorite(@Param("organizationId") Long organizationId, @Param("locationId") Long locationId);

    @Query(value = "SELECT * FROM location.organization_locations WHERE organization_id = :organizationId", nativeQuery = true)
    Set<OrganizationLocationEntity> findByOrganizationId(Long organizationId);

}
