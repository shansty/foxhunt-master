package com.itechart.foxhunt.api.location;

import com.itechart.foxhunt.api.auth.security.LoggedUserService;
import com.itechart.foxhunt.api.core.OrganizationId;
import com.itechart.foxhunt.api.feature.CheckFeature;
import com.itechart.foxhunt.api.location.dto.CloneLocationRequest;
import com.itechart.foxhunt.api.location.dto.LocationFullDto;
import com.itechart.foxhunt.api.location.dto.LocationShortDto;
import com.itechart.foxhunt.api.location.mapper.LocationMapper;
import com.itechart.foxhunt.api.location.service.OrganizationLocationService;
import com.itechart.foxhunt.api.user.dto.User;
import com.itechart.foxhunt.domain.enums.FeatureType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

import static com.itechart.foxhunt.api.core.ApiConstants.*;

@RequiredArgsConstructor
@RestController
@RequestMapping(value = LOCATIONS, produces = MediaType.APPLICATION_JSON_VALUE)
@Slf4j
@Validated
public class LocationControllerImpl implements LocationController {

    private final OrganizationLocationService locationService;
    private final LocationMapper locationMapper;
    private final LoggedUserService loggedUserService;

    private final Sort defaultResultSorting = Sort.by("name");

    @GetMapping
    @Override
    public ResponseEntity<Page<LocationShortDto>> getAllOrganizationLocations(Pageable pageable,
                                                                              OrganizationId organizationId) {
        log.info("Is organization presented : {}", organizationId != null);
        Pageable sortedByNamePageable = PageRequest
            .of(pageable.getPageNumber(), pageable.getPageSize(), defaultResultSorting);
        log.debug("Received request to get all locations for organization with ID {}", organizationId);
        Page<LocationFullDto> locations = locationService.getAll(organizationId.getId(), sortedByNamePageable);
        Page<LocationShortDto> result = locations.map(locationMapper::convertToShortDto);
        log.debug("Returning {} locations for organization with ID {}", locations.getSize(), organizationId);
        return ResponseEntity.ok(result);
    }

    @GetMapping(FAVORITE)
    @Override
    public ResponseEntity<List<LocationShortDto>> getAllFavoriteLocations(OrganizationId organizationId,
                                                                          Pageable pageable) {
        log.info("Is organization presented : {}", organizationId != null);
        log.debug("Received request to get all favorite locations for organization with ID {}", organizationId);
        List<LocationFullDto> locations = locationService.getAllFavorite(organizationId.getId(), pageable);
        List<LocationShortDto> result = locations.stream()
            .map(locationMapper::convertToShortDto)
            .collect(Collectors.toList());
        log.debug("Returning {} favorite locations for organization with ID {}", locations.size(), organizationId);
        return ResponseEntity.ok(result);
    }

    @GetMapping(params = "name")
    @Override
    public ResponseEntity<Page<LocationShortDto>> getOrganizationLocationByName(Pageable pageable,
                                                                                @RequestParam(required = false) String name,
                                                                                OrganizationId organizationId) {
        Pageable sortedByNamePageable = PageRequest
            .of(pageable.getPageNumber(), pageable.getPageSize(), defaultResultSorting);
        log.debug("Received request to get all locations for organization {} with name {}", organizationId, name);
        Page<LocationFullDto> locations = locationService.getAllByLocationName(organizationId.getId(), sortedByNamePageable, name);
        Page<LocationShortDto> result = locations.map(locationMapper::convertToShortDto);
        log.debug("{} locations matches criteria name = {} for organization with ID {}", result.getSize(), name, organizationId);
        return ResponseEntity.ok(result);
    }

    @GetMapping(ID)
    @Override
    public LocationFullDto getLocationById(@PathVariable final Long id, OrganizationId organizationId) {
        log.debug("Received request get location with ID  {} for organization with ID {}", id, organizationId);
        return locationService.findByIdAndOrganizationId(id, organizationId.getId());
    }

    @PostMapping
    @CheckFeature(FeatureType.LOCATION_MANAGEMENT)
    @Secured(value = {ROLE_ORGANIZATION_ADMIN, ROLE_TRAINER})
    @Override
    public ResponseEntity<LocationFullDto> createLocation(@RequestBody final LocationFullDto location, OrganizationId organizationId) {
        log.debug("Creating new location with name {} for organization with ID {}", location.getName(), organizationId);
        User loggedUser = loggedUserService.getLoggedUser();
        return new ResponseEntity<>(locationService.create(organizationId.getId(), location, loggedUser),
            HttpStatus.CREATED);
    }

    @PostMapping(params = "sourceId")
    @CheckFeature(FeatureType.LOCATION_MANAGEMENT)
    @Secured(value = {ROLE_ORGANIZATION_ADMIN, ROLE_TRAINER})
    @Override
    public ResponseEntity<LocationFullDto> cloneLocation(OrganizationId organizationId,
                                                         @RequestParam(value = "sourceId", required = false) Long sourceLocationId,
                                                         @RequestBody CloneLocationRequest cloneRequest) {
        log.debug("Cloning location with ID {} in organization with ID {}", sourceLocationId, organizationId.getId());
        User loggedUser = loggedUserService.getLoggedUser();
        LocationFullDto clonedLocation = locationService.clone(organizationId.getId(), sourceLocationId, loggedUser, cloneRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(clonedLocation);
    }

    @PutMapping(ID)
    @CheckFeature(FeatureType.LOCATION_MANAGEMENT)
    @Secured(value = {ROLE_ORGANIZATION_ADMIN, ROLE_TRAINER})
    @Override
    public ResponseEntity<LocationFullDto> updateLocation(@RequestBody final LocationFullDto location,
                                                          @PathVariable final Long id, OrganizationId organizationId) {
        log.debug("Updating location {} for organization {}", id, organizationId);
        return ResponseEntity.ok(locationService.update(id, organizationId.getId(), location));
    }

    @PutMapping(TOGGLE_FAVORITE)
    @CheckFeature(FeatureType.FAVORITE_LOCATION_MANAGEMENT)
    @Secured(value = {ROLE_ORGANIZATION_ADMIN, ROLE_TRAINER})
    @Transactional
    @Override
    public ResponseEntity<Long> toggleFavoriteLocation(@PathVariable final Long id, OrganizationId organizationId) {
        log.debug("Setting favourite flag to location with id {} in organization {}", id, organizationId);
        locationService.toggleFavorite(id, organizationId.getId());
        return ResponseEntity.ok(id);
    }

    @DeleteMapping(ID)
    @CheckFeature(FeatureType.LOCATION_MANAGEMENT)
    @Secured(value = {ROLE_ORGANIZATION_ADMIN, ROLE_TRAINER})
    @Override
    public ResponseEntity<Long> deleteLocation(@PathVariable final Long id, OrganizationId organizationId) {
        log.debug("Removing location with id {} in organization {}", id, organizationId);
        locationService.delete(id, organizationId.getId());
        return ResponseEntity.noContent().build();
    }
}
