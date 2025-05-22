package com.itechart.foxhunt.api.location.dao;

import com.itechart.foxhunt.domain.entity.OrganizationLocationPackageCompositePK;
import com.itechart.foxhunt.domain.entity.location.function.OrganizationLocationPackageFunctionResult;
import org.locationtech.jts.geom.Polygon;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrganizationLocationPackageFunctionRepository extends
    JpaRepository<OrganizationLocationPackageFunctionResult, OrganizationLocationPackageCompositePK> {

    @Query(value = "SELECT * FROM location.f_available_packages(:organization_id, :system_organization_id)"
        + " WHERE location_package_id = :location_package_id", nativeQuery = true)
    Optional<OrganizationLocationPackageFunctionResult> findByByIdAndOrganizationId(@Param("location_package_id") Long id,
                                                                                    @Param("organization_id") Long organizationId,
                                                                                    @Param("system_organization_id") Long systemOrganizationId);

    @Query(value = "SELECT * FROM location.f_available_packages(:organization_id, :system_organization_id)", nativeQuery = true)
    Page<OrganizationLocationPackageFunctionResult> findAllByOrganizationId(Pageable pageable,
                                                                            @Param("organization_id") Long organizationId,
                                                                            @Param("system_organization_id") Long systemOrganizationId);

    @Query(value = "SELECT * FROM location.f_available_packages(:organization_id, :system_organization_id) olp " +
        "INNER JOIN location.location_packages lp ON lp.location_package_id = olp.location_package_id " +
        "WHERE (lp.access_type = 'PRIVATE' and lp.assignment_type = 'AREA_BASED') " +
        "AND (ST_Within(:area, lp.coordinates) " +
        "OR ((ST_Intersects(:area, lp.coordinates) AND NOT(lp.exact_area_match))) " +
        "OR ((ST_Within(lp.coordinates, :area) AND lp.exact_area_match)))", nativeQuery = true)
    List<OrganizationLocationPackageFunctionResult> findPackagesForLocationInclusion(@Param("organization_id") Long organizationId,
                                                                                     @Param("system_organization_id") Long systemOrganizationId,
                                                                                     @Param("area") Polygon area);

    @Query(value = "SELECT * FROM location.f_available_packages(:organization_id, :system_organization_id) olp " +
        "INNER JOIN location.location_packages lp ON lp.location_package_id = olp.location_package_id " +
        "INNER JOIN location.location_package_locations lpl ON lp.location_package_id = lpl.location_package_id " +
        "WHERE NOT((lp.access_type = 'PRIVATE' and lp.assignment_type = 'AREA_BASED') " +
        "AND (ST_Within(:area, lp.coordinates) " +
        "OR ((ST_Intersects(:area, lp.coordinates) AND NOT(lp.exact_area_match))) " +
        "OR ((ST_Within(lp.coordinates, :area) AND lp.exact_area_match))))", nativeQuery = true)
    List<OrganizationLocationPackageFunctionResult> findPackagesForLocationExclusion(@Param("organization_id") Long organizationId,
                                                                                     @Param("system_organization_id") Long systemOrganizationId,
                                                                                     @Param("area") Polygon area);
}
