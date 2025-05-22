package com.itechart.foxhunt.api.location;

import com.itechart.foxhunt.api.core.OrganizationId;
import com.itechart.foxhunt.api.exception.BadRequestException;
import com.itechart.foxhunt.api.feature.CheckFeature;
import com.itechart.foxhunt.api.location.dto.LocationPackageFullDto;
import com.itechart.foxhunt.api.location.dto.LocationPackageShortDto;
import com.itechart.foxhunt.api.location.mapper.LocationPackageMapper;
import com.itechart.foxhunt.api.location.service.OrganizationLocationPackageService;
import com.itechart.foxhunt.domain.entity.location.LocationPackageEntity;
import com.itechart.foxhunt.domain.enums.FeatureType;
import com.itechart.foxhunt.domain.enums.LocationPackageAccessType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

import static com.itechart.foxhunt.api.core.ApiConstants.*;
import static com.itechart.foxhunt.domain.enums.LocationPackageAccessType.SHARED;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping(value = LOCATION_PACKAGES, produces = MediaType.APPLICATION_JSON_VALUE)
public class LocationPackageControllerImpl implements LocationPackageController {

    private final OrganizationLocationPackageService locationPackageService;

    private final LocationPackageMapper locationPackageMapper;

    @GetMapping
    @Secured(value = {ROLE_ORGANIZATION_ADMIN, ROLE_TRAINER})
    @Override
    public ResponseEntity<Page<LocationPackageShortDto>> getAllOrganizationPackages(Pageable pageable,
                                                                                    OrganizationId organizationId) {
        log.info("Received request to retrieve all location packages for organization {}", organizationId.getId());
        Page<LocationPackageFullDto> locationPackages = locationPackageService.getAllOrganizationPackages(pageable, organizationId.getId());
        log.debug("Location package data calculated, building the response ...");

        Page<LocationPackageShortDto> result = locationPackages.map(locationPackageMapper::convertToShortDto);
        log.info("Returning {}/{} location packages for organization {}", result.getTotalElements(), result.getSize(), organizationId.getId());
        return ResponseEntity.ok(result);
    }

    @GetMapping(SYSTEM)
    @Secured(value = {ROLE_SYSTEM_ADMIN})
    @Override
    public ResponseEntity<List<LocationPackageShortDto>> getAllPackages(@RequestParam LocationPackageAccessType accessType) {
        log.info("Returning all packages in the system for criteria {}", accessType);

        if (!SHARED.equals(accessType)) {
            throw new BadRequestException("Retrieving system or private location packages is not supported right now");
        }
        List<LocationPackageEntity> locationPackages = locationPackageService.getAllSystemPackages(SHARED);
        log.debug("Location package data calculated, building the response ...");

        List<LocationPackageShortDto> result = locationPackages.stream()
            .map(locationPackageMapper::convertToShortDtoWithoutLocations)
            .collect(Collectors.toList());
        log.info("Returning {} location packages for system admin", result.size());
        return ResponseEntity.ok(result);
    }

    @GetMapping(ID)
    @Secured(value = {ROLE_ORGANIZATION_ADMIN, ROLE_TRAINER})
    @Override
    public LocationPackageFullDto getOne(@PathVariable Long id, OrganizationId organizationId) {
        log.debug("Received request to retrieve package {} for organization {}", id, organizationId.getId());
        return locationPackageService.findById(id, organizationId.getId());
    }

    @PostMapping
    @CheckFeature(FeatureType.LOCATION_PACKAGE_MANAGEMENT)
    @Secured(value = {ROLE_ORGANIZATION_ADMIN, ROLE_TRAINER})
    @Override
    public ResponseEntity<LocationPackageFullDto> createOne(@RequestBody final LocationPackageFullDto locationPackage,
                                                            OrganizationId organizationId) {
        log.debug("Received request to create new package in organization {}", organizationId.getId());
        return new ResponseEntity<>(locationPackageService.create(organizationId.getId(), locationPackage),
            HttpStatus.CREATED);
    }

    @PutMapping(ID)
    @CheckFeature(FeatureType.LOCATION_PACKAGE_MANAGEMENT)
    @Secured(value = {ROLE_ORGANIZATION_ADMIN, ROLE_TRAINER})
    @Override
    public ResponseEntity<LocationPackageFullDto> updateOne(@RequestBody final LocationPackageFullDto locationPackage,
                                                            @PathVariable final Long id,
                                                            OrganizationId organizationId) {
        log.debug("Received request to update location package {} in organization {}", id, organizationId.getId());
        locationPackage.setLocationPackageId(id);
        return ResponseEntity.ok(locationPackageService.update(id, organizationId.getId(), locationPackage));
    }

    @DeleteMapping(ID)
    @CheckFeature(FeatureType.LOCATION_PACKAGE_MANAGEMENT)
    @Secured(value = {ROLE_ORGANIZATION_ADMIN, ROLE_TRAINER})
    @Override
    public ResponseEntity<Long> deleteOne(@PathVariable final Long id, OrganizationId organizationId) {
        log.info("Received request to delete location package {} in organization {}", id, organizationId.getId());
        locationPackageService.delete(id, organizationId.getId());
        log.debug("Location package with id {} in organization {} removed", id, organizationId.getId());
        return ResponseEntity.ok(id);
    }
}
