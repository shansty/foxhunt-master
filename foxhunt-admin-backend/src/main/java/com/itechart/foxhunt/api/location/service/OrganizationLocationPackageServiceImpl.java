package com.itechart.foxhunt.api.location.service;

import com.itechart.foxhunt.api.auth.security.LoggedUserService;
import com.itechart.foxhunt.api.exception.BadRequestException;
import com.itechart.foxhunt.api.location.dao.LocationPackageRepository;
import com.itechart.foxhunt.api.location.dao.OrganizationLocationPackageFunctionRepository;
import com.itechart.foxhunt.api.location.dao.OrganizationLocationPackageRepository;
import com.itechart.foxhunt.api.location.dto.LocationPackageFullDto;
import com.itechart.foxhunt.api.location.mapper.LocationPackageMapper;
import com.itechart.foxhunt.api.organization.Organization;
import com.itechart.foxhunt.api.organization.OrganizationService;
import com.itechart.foxhunt.domain.entity.OrganizationLocationPackageCompositePK;
import com.itechart.foxhunt.domain.entity.OrganizationLocationPackageEntity;
import com.itechart.foxhunt.domain.entity.UserEntity;
import com.itechart.foxhunt.domain.entity.location.LocationEntity;
import com.itechart.foxhunt.domain.entity.location.LocationPackageEntity;
import com.itechart.foxhunt.domain.entity.location.function.OrganizationLocationPackageFunctionResult;
import com.itechart.foxhunt.domain.enums.LocationPackageAccessType;
import com.itechart.foxhunt.domain.enums.LocationPackageAssignmentType;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.locationtech.jts.geom.Polygon;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Set;

import static com.itechart.foxhunt.api.location.service.LocationConstantsStorage.SYSTEM_ORGANIZATION_ID;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrganizationLocationPackageServiceImpl implements OrganizationLocationPackageService {

    private final LocationPackageRepository locationPackageRepository;

    private final OrganizationLocationPackageFunctionRepository orgLocationPackageFunctionRepository;

    private final OrganizationLocationPackageRepository orgLocationPackageRepository;

    private final OrganizationService organizationService;

    private final LocationPackageAssignmentService locationPackageAssignmentService;

    private final LocationPackageMapper locationPackageMapper;

    private final LoggedUserService loggedUserService;

    private static final Set<LocationPackageAccessType> systemOrganizationAvailableTypes
        = Set.of(LocationPackageAccessType.SHARED, LocationPackageAccessType.SYSTEM);

    private static final Set<LocationPackageAccessType> nonSystemOrganizationAvailableTypes
        = Set.of(LocationPackageAccessType.PRIVATE);

    @Override
    public Page<LocationPackageFullDto> getAllOrganizationPackages(Pageable pageable, final Long organizationId) {
        log.debug("Received request to get all Location Packages for organization {}, page {}/{}",
            organizationId, pageable.getPageNumber(), pageable.getPageSize());

        Page<LocationPackageFullDto> result = orgLocationPackageFunctionRepository
            .findAllByOrganizationId(pageable, organizationId, SYSTEM_ORGANIZATION_ID)
            .map(this::buildLocationPackageDto);

        log.debug("Returning {} / {} Location Packages for organization {}",
            result.getTotalElements(), result.getSize(), organizationId);

        return result;
    }

    @Override
    public List<LocationPackageEntity> getAllSystemPackages(LocationPackageAccessType accessType) {
        log.debug("Received request to get all system location packages");
        return locationPackageRepository.findAllPackagesByAccessType(accessType.name());
    }

    @Override
    @SneakyThrows
    public LocationPackageFullDto findById(final Long locationPackageId, final Long organizationId) {
        log.debug("Getting location package with id {} in organization {}", locationPackageId, organizationId);
        OrganizationLocationPackageFunctionResult entity = getOrgLocationPackage(locationPackageId, organizationId);
        log.debug("Location package with id {} in organization {} found, returning the response...", locationPackageId, organizationId);

        return buildLocationPackageDto(entity);
    }


    @Override
    @Transactional
    public void delete(final Long locationPackageId, final Long organizationId) {
        UserEntity user = loggedUserService.getLoggedUserEntity();
        log.debug("Removing location package with id {} in organization {} for user {}", locationPackageId, organizationId, user.getEmail());
        OrganizationLocationPackageFunctionResult entity = getOrgLocationPackage(locationPackageId, organizationId);
        checkUpdatable(locationPackageId, organizationId, entity);

        log.info("Location {} from organization {} can be removed by user {}", locationPackageId, organizationId, user.getEmail());
        orgLocationPackageRepository.deleteByLocationPackageId(locationPackageId); //TODO Cascade
        log.debug("Location package {} unassigned from all organizations", locationPackageId);
        entity.setLocationPackageEntity(null);
        locationPackageRepository.deleteById(locationPackageId);
        log.debug("Location package {} completely removed from all organizations", locationPackageId);
    }

    @Override
    public LocationPackageFullDto update(Long locationPackageId, Long organizationId, LocationPackageFullDto locationPackage) {
        if (LocationPackageAssignmentType.AREA_BASED.equals(locationPackage.getAssignmentType())) {
            checkWithinEarthCoordinates(locationPackage.getCoordinates());
        }

        UserEntity user = loggedUserService.getLoggedUserEntity();
        log.debug("Updating location package with id {} in organization {} for user {}", locationPackageId, organizationId, user.getEmail());
        OrganizationLocationPackageFunctionResult entity = getOrgLocationPackage(locationPackageId, organizationId);
        Organization organization = organizationService.findOrganizationById(organizationId);

        checkUpdatable(locationPackageId, organizationId, entity);
        checkEditable(organizationId, locationPackage.getAccessType(), user, organization);
        log.info("Validation for update of location package {} in organization {} finished, updating...,", locationPackageId, organizationId);

        Long id = locationPackage.getLocationPackageId();
        LocationPackageEntity locationPackageEntity = locationPackageMapper.domainToEntity(locationPackage);
        Set<LocationEntity> packageLocations = locationPackageAssignmentService.getAssociatedLocations(locationPackageEntity, organizationId);
        locationPackageEntity.setLocationPackageId(id);
        locationPackageEntity.setUpdateDate(LocalDateTime.now());
        locationPackageEntity.setCreatedBy(entity.getLocationPackageEntity().getCreatedBy());
        locationPackageEntity.setUpdatedBy(user);
        locationPackageEntity.setCreationDate(entity.getLocationPackageEntity().getCreationDate());
        locationPackageEntity.setLocations(packageLocations);

        locationPackageRepository.save(locationPackageEntity);
        log.info("Location package with Id  {} has been updated by user {}", locationPackageId, user.getEmail());

        return buildLocationPackageDto(locationPackageEntity, true);
    }

    @Override
    public LocationPackageFullDto create(final Long organizationId, final LocationPackageFullDto newLocationPackage) {
        //TODO duplicates
        if (LocationPackageAssignmentType.AREA_BASED.equals(newLocationPackage.getAssignmentType())) {
            checkWithinEarthCoordinates(newLocationPackage.getCoordinates());
        }

        UserEntity user = loggedUserService.getLoggedUserEntity();
        Organization organization = organizationService.findOrganizationById(organizationId);

        checkEditable(organizationId, newLocationPackage.getAccessType(), user, organization);
        log.info("Validation for create of location package {} in organization {} finished, creating...", newLocationPackage.getName(), organizationId);

        LocationPackageEntity locationPackageEntity = locationPackageMapper.domainToEntity(newLocationPackage);
        Set<LocationEntity> packageLocations = locationPackageAssignmentService.getAssociatedLocations(locationPackageEntity, organizationId);
        locationPackageEntity.setCreatedBy(user);
        locationPackageEntity.setUpdatedBy(null);
        locationPackageEntity.setLocations(packageLocations);

        locationPackageRepository.save(Objects.requireNonNull(locationPackageEntity));
        log.info("Location package {} in organization {} created, moving to org assignment...", locationPackageEntity.getName(), organizationId);
        if (!locationPackageEntity.getAccessType().equals(LocationPackageAccessType.SYSTEM)) {
            log.debug("New location package {} is not system, linking it to the organization {}",
                locationPackageEntity.getLocationPackageId(), organizationId);

            OrganizationLocationPackageEntity olpEntity = new OrganizationLocationPackageEntity();
            olpEntity.setId(new OrganizationLocationPackageCompositePK(organizationId, locationPackageEntity.getLocationPackageId()));
            olpEntity.setLocationPackageEntity(locationPackageEntity);
            orgLocationPackageRepository.save(olpEntity);
            log.info("Location Package {} has been linked to organization {}", locationPackageEntity.getLocationPackageId(), organizationId);
        }

        log.info("Create new location package: {}", locationPackageEntity);

        return buildLocationPackageDto(locationPackageEntity, true);
    }

    private OrganizationLocationPackageFunctionResult getOrgLocationPackage(Long locationPackageId, Long organizationId) {
        return orgLocationPackageFunctionRepository
            .findByByIdAndOrganizationId(locationPackageId, organizationId, SYSTEM_ORGANIZATION_ID)
            .orElseThrow(() -> {
                log.warn("Unable to find location package with id {} in organization {}", locationPackageId, organizationId);
                throw new EntityNotFoundException("Unable to find location package with ID " + locationPackageId);
            });
    }

    private void checkWithinEarthCoordinates(Polygon coordinates) {
        log.info("Validating is area based package within Earth coordinates");
        boolean withinEarthCoordinates =
            locationPackageRepository.isPackageAreaWithinEarthCoordinates(coordinates);
        if (!withinEarthCoordinates) {
            log.error("Location package area {} is not within Earth coordinates", coordinates);
            throw new BadRequestException("Location package area is not within Earth coordinates");
        }
    }

    private void checkUpdatable(Long locationPackageId, Long organizationId, OrganizationLocationPackageFunctionResult entity) {
        if (!entity.getIsUpdatable()) {
            log.warn("Location location package {} in organization {} is not updatable", locationPackageId, organizationId);
            throw new IllegalArgumentException("Location package with ID " + locationPackageId + " is not updtable");
        }
    }

    private void checkEditable(Long organizationId, LocationPackageAccessType accessType, UserEntity user, Organization organization) {
        if (!isValidAccessType(accessType, organization)) {
            log.warn("User {} has no rights to manipulate location packages in organization {}", user.getEmail(), organizationId);
            throw new IllegalArgumentException("User " + user.getEmail() + " has no rights to manipulate location packages");
        }
    }

    private LocationPackageFullDto buildLocationPackageDto(OrganizationLocationPackageFunctionResult entity) {
        return buildLocationPackageDto(entity.getLocationPackageEntity(), entity.getIsUpdatable());
    }

    private LocationPackageFullDto buildLocationPackageDto(LocationPackageEntity entity, boolean isUpdatable) {
        LocationPackageFullDto dto = locationPackageMapper.entityToDomain(entity);
        dto.setIsUpdatable(isUpdatable);
        return dto;
    }

    public boolean isValidAccessType(LocationPackageAccessType accessType,
                                     Organization organization) {
        return organization.isSystem()
            ? systemOrganizationAvailableTypes.contains(accessType)
            : nonSystemOrganizationAvailableTypes.contains(accessType);
    }
}
