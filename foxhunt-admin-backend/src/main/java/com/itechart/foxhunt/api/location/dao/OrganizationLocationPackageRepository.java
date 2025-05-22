package com.itechart.foxhunt.api.location.dao;

import com.itechart.foxhunt.domain.entity.OrganizationLocationPackageCompositePK;
import com.itechart.foxhunt.domain.entity.OrganizationLocationPackageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrganizationLocationPackageRepository extends
    JpaRepository<OrganizationLocationPackageEntity, OrganizationLocationPackageCompositePK> {

    @Query(value = "SELECT location.organization_location_packages.* " +
        "FROM location.organization_location_packages INNER JOIN location.location_packages " +
        "ON location.organization_location_packages.location_package_id =  location.location_packages.location_package_id " +
        "WHERE location.location_packages.access_type = :accessType", nativeQuery = true)
    List<OrganizationLocationPackageEntity> findAllOrganizationPackagesByAccessType(@Param("accessType") String accessType);

    @Modifying
    @Query(value = "DELETE FROM location.organization_location_packages olp "
        + " WHERE  olp.location_package_id = :location_package_id", nativeQuery = true)
    void deleteByLocationPackageId(@Param("location_package_id") Long id);

}
