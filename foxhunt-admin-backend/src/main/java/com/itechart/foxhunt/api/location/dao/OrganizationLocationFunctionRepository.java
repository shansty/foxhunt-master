package com.itechart.foxhunt.api.location.dao;

import com.itechart.foxhunt.domain.entity.OrganizationLocationCompositePK;
import com.itechart.foxhunt.domain.entity.location.function.OrganizationLocationFunctionResult;
import org.locationtech.jts.geom.Polygon;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface OrganizationLocationFunctionRepository extends
    JpaRepository<OrganizationLocationFunctionResult, OrganizationLocationCompositePK> {
    @Query(value = "SELECT * FROM location.f_available_locations(:organization_id, :system_organization_id)"
        + " WHERE location_id = :location_id", nativeQuery = true)
    Optional<OrganizationLocationFunctionResult> findOrganizationLocationByLocationIdAndOrganizationId(@Param("location_id") Long id,
                                                                                                       @Param("organization_id") Long organizationId,
                                                                                                       @Param("system_organization_id") Long systemOrganizationId);

    @Query(value = "SELECT al.* FROM location.f_available_locations(:organization_id, :system_organization_id) al " +
        " INNER JOIN location.locations l ON al.location_id  = l.location_id" +
        " WHERE ST_Within(l.coordinates, :area)", nativeQuery = true)
    Set<OrganizationLocationFunctionResult> findOrganizationLocationsInsideArea(@Param("area") Polygon area,
                                                                                @Param("organization_id") Long organizationId,
                                                                                @Param("system_organization_id") Long systemOrganizationId);

    @Query(value = "SELECT al.* FROM location.f_available_locations(:organization_id, :system_organization_id) al " +
        " INNER JOIN location.locations l ON al.location_id  = l.location_id" +
        " WHERE ST_Intersects(l.coordinates, :area)", nativeQuery = true)
    Set<OrganizationLocationFunctionResult> findOrganizationLocationsIntersectingArea(@Param("area") Polygon area,
                                                                                      @Param("organization_id") Long organizationId,
                                                                                      @Param("system_organization_id") Long systemOrganizationId);

    @Query(value = "SELECT * FROM location.f_available_locations(:organization_id, :system_organization_id) ", nativeQuery = true)
    Page<OrganizationLocationFunctionResult> findAllByOrganizationId(@Param("organization_id") Long organizationId,
                                                                     @Param("system_organization_id") Long systemOrganizationId,
                                                                     Pageable pageable);

    @Query(value = "SELECT * FROM location.f_available_locations(:organization_id, :system_organization_id) " +
        " WHERE is_favorite = true", nativeQuery = true)
    Page<OrganizationLocationFunctionResult> findAllFavoriteByOrganizationId(@Param("organization_id") Long organizationId,
                                                                             @Param("system_organization_id") Long systemOrganizationId,
                                                                             Pageable pageable);

    @Query(value = "SELECT * FROM location.f_available_locations(:organization_id, :system_organization_id)" +
        " WHERE name LIKE %:location_name%", nativeQuery = true)
    Page<OrganizationLocationFunctionResult> searchByLocationNameAndOrganization(Pageable pageable,
                                                                                 @Param("system_organization_id") Long systemOrganizationId,
                                                                                 @Param("organization_id") Long organizationId,
                                                                                 @Param("location_name") String locationName);

    @Query(value = "SELECT * FROM location.f_available_locations(:organization_id, :system_organization_id)"
        + " WHERE location_id in :location_ids", nativeQuery = true)
    Set<OrganizationLocationFunctionResult> findLocationsByLocationIdsAndOrganizationId(@Param("location_ids") List<Long> ids,
                                                                                        @Param("organization_id") Long organizationId,
                                                                                        @Param("system_organization_id") Long systemOrganizationId);

}
