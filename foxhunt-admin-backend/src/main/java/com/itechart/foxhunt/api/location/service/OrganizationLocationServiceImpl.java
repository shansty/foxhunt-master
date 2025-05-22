package com.itechart.foxhunt.api.location.service;

import com.itechart.foxhunt.api.auth.security.LoggedUserService;
import com.itechart.foxhunt.api.exception.BadRequestException;
import com.itechart.foxhunt.api.location.dao.LocationRepository;
import com.itechart.foxhunt.api.location.dao.OrganizationLocationFunctionRepository;
import com.itechart.foxhunt.api.location.dao.OrganizationLocationRepository;
import com.itechart.foxhunt.api.location.dto.CloneLocationRequest;
import com.itechart.foxhunt.api.location.dto.LocationFullDto;
import com.itechart.foxhunt.api.location.mapper.LocationMapper;
import com.itechart.foxhunt.api.organization.Organization;
import com.itechart.foxhunt.api.organization.OrganizationService;
import com.itechart.foxhunt.api.user.dto.User;
import com.itechart.foxhunt.domain.entity.OrganizationLocationCompositePK;
import com.itechart.foxhunt.domain.entity.OrganizationLocationEntity;
import com.itechart.foxhunt.domain.entity.UserEntity;
import com.itechart.foxhunt.domain.entity.location.LocationEntity;
import com.itechart.foxhunt.domain.entity.location.function.OrganizationLocationFunctionResult;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.tuple.Pair;
import org.locationtech.jts.geom.Polygon;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import static com.itechart.foxhunt.api.location.service.LocationConstantsStorage.SYSTEM_ORGANIZATION_ID;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrganizationLocationServiceImpl implements OrganizationLocationService {

    private final LocationRepository locationRepository;

    private final OrganizationLocationRepository organizationLocationRepository; //TODO no need in DAO, add to One-To-Many collection

    private final OrganizationLocationFunctionRepository organizationLocationFunctionRepository;

    private final LocationMapper locationMapper;

    private final OrganizationService organizationService; //TODO get rid of it somehow

    private final LocationPackageAssignmentService locationPackageAssignmentService;

    private final LoggedUserService loggedUserService;

    @Override
    public Page<LocationFullDto> getAll(final Long organizationId, Pageable pageable) {
        log.debug("Received request to get all locations available in organization {}, page {}/{}", organizationId, pageable.getPageNumber(), pageable.getPageNumber());

        Page<OrganizationLocationFunctionResult> page = organizationLocationFunctionRepository
            .findAllByOrganizationId(organizationId, SYSTEM_ORGANIZATION_ID, pageable);
        log.debug("Organization {} has access to {} locations, building the response",
            organizationId, page.getTotalElements());
        return buildLocationPage(organizationId, page);
    }

    @Override
    public List<LocationFullDto> getAllFavorite(Long organizationId, Pageable pageable) {
        log.debug("Received request to get all favorite locations available in organization {}, page {}/{}",
            organizationId, pageable.getPageNumber(), pageable.getPageNumber());
        Page<OrganizationLocationFunctionResult> page = organizationLocationFunctionRepository
            .findAllFavoriteByOrganizationId(organizationId, SYSTEM_ORGANIZATION_ID, pageable);
        log.debug("Organization {} has access to {} favorite locations, building the response",
            organizationId, page.getTotalElements());
        return buildLocationPage(organizationId, page).getContent();
    }

    @Override
    public Page<LocationFullDto> getAllByLocationName(Long organizationId, Pageable pageable, String name) {
        log.debug("Received request to get all locations by name {} in organization {}", name, organizationId);
        Page<OrganizationLocationFunctionResult> page = organizationLocationFunctionRepository
            .searchByLocationNameAndOrganization(pageable, SYSTEM_ORGANIZATION_ID, organizationId, name);

        return buildLocationPage(organizationId, page);
    }

    @Override
    @SneakyThrows
    public LocationFullDto findByIdAndOrganizationId(final Long locationId, final Long organizationId) {
        log.debug("Getting location with ID {} for organization {}", locationId, organizationId);
        OrganizationLocationFunctionResult orgLocation = getLocationBelongingToOrganization(locationId, organizationId);
        return buildLocationDto(orgLocation);
    }

    @Transactional
    @Override
    @SneakyThrows
    public void delete(final Long locationId, final Long organizationId) {
        UserEntity loggedUser = loggedUserService.getLoggedUserEntity();

        log.info("Removing of location with ID {} for organization {}, initiated by {}",
            locationId, organizationId, loggedUser.getEmail());
        getAccessibleLocationOrAbort(locationId, organizationId, loggedUser);

        log.debug("Location with ID {} removal : removal of associated packages", locationId);
        //TODO CASCADE
        locationPackageAssignmentService.deleteLocationPackagesCascade(locationId);
        log.debug("Location with ID {} removal : removal of associated organizations", locationId);
        organizationLocationRepository.deleteByLocationId(locationId); //TODO Cascade
        log.debug("Location with ID {} removal : removal of the Location entity", locationId);
        locationRepository.deleteById(locationId);
        log.info("Location with ID {} for organization {} removed, initiated by {}",
            locationId, organizationId, loggedUser.getEmail());
    }

    @Override
    @Transactional
    public LocationFullDto update(final Long locationId, final Long organizationId, final LocationFullDto updatedLocation) {
        updatedLocation.setName(updatedLocation.getName().trim());
        validateUpdatedName(organizationId, updatedLocation);
        checkWithinEarthCoordinates(updatedLocation.getCoordinates());
        UserEntity loggedUser = loggedUserService.getLoggedUserEntity();

        log.debug("Preparing to update location with id {} in organization {}", locationId, organizationId);
        OrganizationLocationFunctionResult orgLocation = getAccessibleLocationOrAbort(locationId, organizationId, loggedUser);

        LocationEntity originalLocation = orgLocation.getLocationEntity();
        log.debug("Validation of Update Location request finished, moving to updating of the fields");
        LocationEntity entity = locationMapper.domainToEntity(updatedLocation);
        entity.setId(locationId);
        entity.setIsGlobal(originalLocation.getIsGlobal());
        entity.setCreatedDate(originalLocation.getCreatedDate());
        entity.setUpdatedDate(LocalDateTime.now());
        entity.setUpdatedBy(loggedUser);
        entity.setRevision(originalLocation.getRevision());

        log.debug("Saving the updates for location with {} from user {}", locationId, loggedUser.getEmail());
        boolean shouldPackagesBeUpdated = !locationRepository.isAreaMatchesToLocation(locationId, updatedLocation.getCoordinates());
        entity = locationRepository.save(entity);
        log.debug("Changes to Location {} saved", locationId);
        if (shouldPackagesBeUpdated) {
            log.debug("An area of location {} has been modified, going to update associated packages", locationId);
            locationPackageAssignmentService.refreshAssociatedLocationPackages(organizationId, entity, loggedUser);
            log.info("Location packages to location location {} has been updated", locationId);
        }

        return buildLocationDto(entity, true); //if we reach that point, we can update the location
    }

    @Override
    @Transactional
    public LocationFullDto create(final Long organizationId, final LocationFullDto newLocation, User loggedUser) {
        log.debug("Validating create location request for organization {}", organizationId);
        newLocation.setName(newLocation.getName().trim());

        checkLocationNameUniqueInOrganization(organizationId, newLocation.getName());
        checkWithinEarthCoordinates(newLocation.getCoordinates());

        log.debug("Preparing to create new location with name {} in organization {}", newLocation.getName(), organizationId);
        Organization organization = organizationService.findOrganizationById(organizationId);
        newLocation.setCreatedBy(loggedUser);
        final LocationEntity entity = locationMapper.domainToEntity(newLocation);

        entity.setId(null);
        entity.setUpdatedBy(null);
        entity.setIsGlobal(organization.isSystem());
        log.debug("Will new location with name {} in organization {} be global ? {} ", newLocation.getName(), organizationId, organization.isSystem());

        entity.setForbiddenAreas(entity.getForbiddenAreas()
            .stream()
            .filter(forbiddenArea -> !forbiddenArea.getCoordinates().isEmpty())
            .collect(Collectors.toList()));

        final LocationEntity locationEntity = locationRepository.save(Objects.requireNonNull(entity));
        log.info("New location with name {} in organization {} created with ID {} ", locationEntity.getName(), organizationId, locationEntity.getId());

        if (!locationEntity.getIsGlobal()) {
            log.debug("New location {} is not global, linking it to the organization {}", locationEntity.getId(), organizationId);

            OrganizationLocationEntity organizationLocationEntity = new OrganizationLocationEntity();
            OrganizationLocationCompositePK id = new OrganizationLocationCompositePK(organizationId, locationEntity.getId());
            organizationLocationEntity.setId(id);
            organizationLocationEntity.setLocationEntity(locationEntity);
            organizationLocationRepository.save(organizationLocationEntity);
            log.info("Location {} has been linked to organization {}", locationEntity.getId(), organizationId);
        }

        log.debug("Linking new location {} to location packages for organization {}", locationEntity.getId(), organizationId);

        locationPackageAssignmentService.refreshAssociatedLocationPackages(organizationId, locationEntity, entity.getCreatedBy());
        log.info("New location {} in organization {} created successfully, building the response", locationEntity.getId(), organizationId);

        return buildLocationDto(locationEntity, true); //if we reach that point, we can update the location
    }

    @Override
    public LocationFullDto clone(Long organizationId, Long locationId, User clonedBy, CloneLocationRequest cloneRequest) {
        LocationFullDto fetchedLocation = findByIdAndOrganizationId(locationId, organizationId);
        LocationFullDto locationToClone = locationMapper.mergeToDomain(fetchedLocation, cloneRequest);
        locationToClone.setIsCloned(true);
        return create(organizationId, locationToClone, clonedBy);
    }

    @Override
    public void toggleFavorite(Long locationId, Long organizationId) {
        OrganizationLocationFunctionResult orgLocation = getLocationBelongingToOrganization(locationId, organizationId);
        log.info("Is location {} in organization {} favorite/virtual: {}, {}", locationId, organizationId, orgLocation.getIsFavorite(), orgLocation.getIsVirtual());
        if (orgLocation.getIsFavorite()) {
            organizationLocationRepository.removeLocationFromFavorite(organizationId, locationId);
            log.info("Location with id: {} successfully removed from Favorite for organization {}", locationId, organizationId);
        } else {
            organizationLocationRepository.addLocationToFavorite(organizationId, locationId);
            log.info("Location with id: {} successfully added to Favorite for organization {}", locationId, organizationId);
        }
    }

    private OrganizationLocationFunctionResult getAccessibleLocationOrAbort(Long locationId, Long organizationId, UserEntity userEntity) {
        return Optional.of(getLocationBelongingToOrganization(locationId, organizationId)).filter(location -> {
            log.info("Verifying if user {} has rights to manipulate location {} in organization {}? {}",
                userEntity.getEmail(), locationId, organizationId, location.getIsUpdatable());
            return location.getIsUpdatable();
        }).orElseThrow(() -> {
            log.warn("User {} can't manipulate location {} in organization {}",
                userEntity.getEmail(), locationId, organizationId);
            throw new IllegalArgumentException("No rights to manipulate the location " + locationId);
        });
    }

    private OrganizationLocationFunctionResult getLocationBelongingToOrganization(Long locationId, Long organizationId) {
        return organizationLocationFunctionRepository
            .findOrganizationLocationByLocationIdAndOrganizationId(locationId, organizationId, SYSTEM_ORGANIZATION_ID)
            .orElseThrow(() -> {
                log.warn("Unable to find location with ID {} belonging to organization {}", locationId, organizationId);
                throw new EntityNotFoundException("Unable to find location with ID " + locationId + " belonging to the requested organization");
            });
    }

    private void checkWithinEarthCoordinates(Polygon coordinates) {
        log.debug("Validating is location area within Earth coordinates");
        boolean withinEarthCoordinates = locationRepository.isAreaWithinEarthCoordinates(coordinates);
        if (!withinEarthCoordinates) {
            log.error("Provided location area {} is not within Earth coordinates", coordinates);
            throw new BadRequestException("Location area is not within Earth coordinates");
        }
    }

    private void checkLocationNameUniqueInOrganization(Long organizationId, String locationName) {
        if (organizationLocationRepository.existsByOrganizationAnLocationName(organizationId, locationName)) {
            throwNotUniqueName(organizationId, locationName);
        }
    }

    private void validateUpdatedName(Long organizationId, LocationFullDto updatedLocation) {
        Long updatedLocationId = updatedLocation.getId();
        String updatedLocationName = updatedLocation.getName();

        Set<Long> sameLocationNameIds = organizationLocationRepository.findByOrganizationId(organizationId).stream()
            .map(entity -> Pair.of(entity.getLocationEntity().getId(), entity.getLocationEntity().getName()))
            .filter(pair -> pair.getRight().equals(updatedLocationName))
            .map(Pair::getLeft)
            .filter(id -> !id.equals(updatedLocationId))
            .collect(Collectors.toSet());

        if (!sameLocationNameIds.isEmpty()) {
            throwNotUniqueName(organizationId, updatedLocationName);
        }
    }

    private void throwNotUniqueName(Long organizationId, String locationName) {
        String msg = String.format("Location with name %s already exists in organization %s.", locationName, organizationId);
        log.error(msg);
        throw new BadRequestException(msg);
    }

    private Page<LocationFullDto> buildLocationPage(Long organizationId, Page<OrganizationLocationFunctionResult> page) {
        return page.map(orgLocation -> {
            LocationFullDto locationDto = buildLocationDto(orgLocation);
            log.trace("Is location {} updatable in organization {} ? {}",
                locationDto.getId(), organizationId, orgLocation.getIsUpdatable());
            return locationDto;
        });
    }

    private LocationFullDto buildLocationDto(OrganizationLocationFunctionResult orgLocation) {
        return locationMapper.entityToDomain(orgLocation.getLocationEntity(), orgLocation);
    }

    private LocationFullDto buildLocationDto(LocationEntity location, Boolean isUpdatable) {
        LocationFullDto result = locationMapper.entityToDomain(location);
        result.setIsUpdatable(isUpdatable);
        return result;
    }
}
