package com.itechart.foxhunt.api.location.service;

import com.itechart.foxhunt.api.location.dao.LocationPackageRepository;
import com.itechart.foxhunt.api.location.dao.OrganizationLocationFunctionRepository;
import com.itechart.foxhunt.api.location.dao.OrganizationLocationPackageFunctionRepository;
import com.itechart.foxhunt.domain.entity.UserEntity;
import com.itechart.foxhunt.domain.entity.location.LocationEntity;
import com.itechart.foxhunt.domain.entity.location.LocationPackageEntity;
import com.itechart.foxhunt.domain.entity.location.function.OrganizationLocationFunctionResult;
import com.itechart.foxhunt.domain.entity.location.function.OrganizationLocationPackageFunctionResult;
import com.itechart.foxhunt.domain.enums.LocationPackageAssignmentType;
import org.locationtech.jts.geom.Polygon;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static com.itechart.foxhunt.api.location.service.LocationConstantsStorage.SYSTEM_ORGANIZATION_ID;

@Service
@RequiredArgsConstructor
@Slf4j
public class LocationPackageAssignmentServiceImpl implements LocationPackageAssignmentService {

    private final OrganizationLocationPackageFunctionRepository olpRepository;

    private final LocationPackageRepository locationPackageRepository;

    private final OrganizationLocationFunctionRepository locationRepository;

    @Override
    @Transactional
    public void refreshAssociatedLocationPackages(Long organizationId, LocationEntity location, UserEntity updatedBy) {
        log.info("Refreshing packages according to location {} changes in organization {}", location.getId(), organizationId);
        Polygon area = location.getCoordinates();

        log.debug("Finding packages to include location {} in organization {}", location.getId(), organizationId);
        List<LocationPackageEntity> packagesToIncludeLocation = extractPackagesFromView(
            olpRepository.findPackagesForLocationInclusion(organizationId, SYSTEM_ORGANIZATION_ID, area));
        includeLocationToPackage(packagesToIncludeLocation, location);
        log.debug("Finding packages to exclude location {} in organization {}", location.getId(), organizationId);
        List<LocationPackageEntity> packagesToExcludeLocation = extractPackagesFromView(
            olpRepository.findPackagesForLocationExclusion(organizationId, SYSTEM_ORGANIZATION_ID, area));
        excludeLocationFromPackages(packagesToExcludeLocation, location);

        List<LocationPackageEntity> packagesToRefresh = new ArrayList<>();
        packagesToRefresh.addAll(packagesToIncludeLocation);
        packagesToRefresh.addAll(packagesToExcludeLocation);
        markPackagesAsUpdated(packagesToRefresh, updatedBy);

        locationPackageRepository.saveAll(packagesToRefresh);
        log.info("All location packages related to location {} in organization {} refreshed", location.getId(), organizationId);
    }

    private void includeLocationToPackage(List<LocationPackageEntity> packagesToIncludeLocation,
                                          LocationEntity location) {
        Long locationId = location.getId();
        packagesToIncludeLocation.forEach(locationPackage -> {
            locationPackage.getLocations().add(location);
            log.debug("Location {} has been added to package {}", locationId, locationPackage.getLocationPackageId());
        });
    }

    private void excludeLocationFromPackages(List<LocationPackageEntity> packagesToExcludeLocation,
                                             LocationEntity location) {
        Long locationId = location.getId();
        packagesToExcludeLocation.forEach(locationPackage -> {
            locationPackage.getLocations().removeIf(loc -> loc.getId().equals(locationId));
            log.debug("Location {} has been excluded from package {}", locationId, locationPackage.getLocationPackageId());
        });
    }

    private void markPackagesAsUpdated(List<LocationPackageEntity> packages, UserEntity user) {
        LocalDateTime packagesUpdateDate = LocalDateTime.now();
        packages.forEach(packageToMark -> {
            packageToMark.setUpdateDate(packagesUpdateDate);
            packageToMark.setUpdatedBy(user);
        });
    }

    private List<LocationPackageEntity> extractPackagesFromView(List<OrganizationLocationPackageFunctionResult> orgLocationPackages) {
        return orgLocationPackages.stream()
            .map(OrganizationLocationPackageFunctionResult::getLocationPackageEntity)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteLocationPackagesCascade(Long locationId) {
        log.info("Unassigning location {} from all location packages", locationId);
        locationPackageRepository.deleteLocationFromLocationPackages(locationId);
        log.info("Location {} unassigned from all organization packages", locationId);
    }

    @Override
    public Set<LocationEntity> getAssociatedLocations(LocationPackageEntity entity, Long organizationId) {
        Set<OrganizationLocationFunctionResult> locations = isAreaBasedLocationPackage(entity) ?
            findLocationsByPackageArea(organizationId, entity) :
            findLocationsByPackage(organizationId, entity);
        log.info("{} locations found for package {} in organization {}", locations.size(), entity.getName(), organizationId);
        return locations.stream().map(OrganizationLocationFunctionResult::getLocationEntity).collect(Collectors.toSet());
    }

    private boolean isAreaBasedLocationPackage(LocationPackageEntity locationPackage) {
        return LocationPackageAssignmentType.AREA_BASED.equals(locationPackage.getAssignmentType());
    }

    private Set<OrganizationLocationFunctionResult> findLocationsByPackageArea(Long organizationId, LocationPackageEntity locationPackage) {
        log.info("Searching for locations related to area-based package {} in organization {}", locationPackage.getName(), organizationId);
        Polygon packageArea = locationPackage.getCoordinates();
        return locationPackage.getExactAreaMatch() ?
            locationRepository.findOrganizationLocationsInsideArea(packageArea, organizationId, SYSTEM_ORGANIZATION_ID) :
            locationRepository.findOrganizationLocationsIntersectingArea(packageArea, organizationId, SYSTEM_ORGANIZATION_ID);
    }

    private Set<OrganizationLocationFunctionResult> findLocationsByPackage(Long organizationId, LocationPackageEntity locationPackage) {
        log.info("Searching for locations related to list-based package {} in organization {}", locationPackage.getName(), organizationId);
        List<Long> locationIds = locationPackage.getLocations().stream()
            .map(LocationEntity::getId)
            .collect(Collectors.toList());
        return locationRepository.findLocationsByLocationIdsAndOrganizationId(locationIds, organizationId, SYSTEM_ORGANIZATION_ID);
    }

}
