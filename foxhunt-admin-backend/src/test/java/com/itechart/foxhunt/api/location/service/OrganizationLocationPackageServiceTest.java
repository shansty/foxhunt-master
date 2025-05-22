package com.itechart.foxhunt.api.location.service;

import com.itechart.foxhunt.api.auth.security.LoggedUserService;
import com.itechart.foxhunt.api.location.dao.LocationPackageRepository;
import com.itechart.foxhunt.api.location.dao.OrganizationLocationPackageFunctionRepository;
import com.itechart.foxhunt.api.location.dao.OrganizationLocationPackageRepository;
import com.itechart.foxhunt.api.location.dto.LocationFullDto;
import com.itechart.foxhunt.api.location.dto.LocationPackageFullDto;
import com.itechart.foxhunt.api.location.dto.LocationShortDto;
import com.itechart.foxhunt.api.location.mapper.*;
import com.itechart.foxhunt.api.location.util.LocationTestUtils;
import com.itechart.foxhunt.api.organization.Organization;
import com.itechart.foxhunt.api.organization.OrganizationService;
import com.itechart.foxhunt.api.user.dto.User;
import com.itechart.foxhunt.api.user.mapper.UserMapperImpl;
import com.itechart.foxhunt.domain.entity.UserEntity;
import com.itechart.foxhunt.domain.entity.location.LocationEntity;
import com.itechart.foxhunt.domain.entity.location.LocationPackageEntity;
import com.itechart.foxhunt.domain.entity.location.function.OrganizationLocationPackageFunctionResult;
import com.itechart.foxhunt.domain.enums.LocationPackageAccessType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import javax.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith({MockitoExtension.class, SpringExtension.class})
@ContextConfiguration(classes = {
    UserMapperImpl.class, LocationPackageMapperImpl.class, LocationMapperImpl.class,
    ForbiddenAreaMapperImpl.class, OrganizationLocationPackageServiceImpl.class
})
@MockitoSettings(strictness = Strictness.LENIENT)
public class OrganizationLocationPackageServiceTest {

    @MockBean
    LocationPackageRepository locationPackageRepository;

    @MockBean
    OrganizationLocationPackageFunctionRepository orgLocationPackageViewRepository;

    @MockBean
    OrganizationLocationPackageRepository orgLocationPackageRepository;

    @MockBean
    OrganizationService organizationService;

    @MockBean
    LocationPackageAssignmentService locationPackageAssignmentService;

    @MockBean
    LoggedUserService loggedUserService;

    @Autowired
    LocationPackageMapper locationPackageMapper;

    @Autowired
    LocationMapper locationMapper;

    @Autowired
    OrganizationLocationPackageService orgLocationPackageService;

    User currentUser;

    UserEntity currentUserEntity;

    @BeforeEach
    public void setup() {
        currentUser = new User();
        currentUser.setId(1L);
        currentUserEntity = new UserEntity();
        currentUserEntity.setId(1L);

        when(loggedUserService.getLoggedUser()).thenReturn(currentUser);
        when(loggedUserService.getLoggedUserEntity()).thenReturn(currentUserEntity);
    }

    @Test
    void expectCreatesPrivateListBasedLocationPackage() {
        //given
        Long organizationId = 1L;
        Organization currentUserOrganization = LocationTestUtils.createOrganization();
        currentUserOrganization.setSystem(false);
        Set<LocationFullDto> locationsToAdd = getLocationsToAdd();

        LocationPackageFullDto locationPackageToCreate = LocationTestUtils.createLocationPackageDto();
        locationPackageToCreate.setLocations(convertToShortDto(locationsToAdd));
        LocationPackageFullDto expectedCreatedLocationPackage = LocationTestUtils.createLocationPackageDto();

        //when
        when(organizationService.findOrganizationById(1L)).thenReturn(currentUserOrganization);
        when(locationPackageAssignmentService.getAssociatedLocations(any(), any())).thenReturn(convertToEntity(locationsToAdd));
        LocationPackageFullDto createdLocationPackage = orgLocationPackageService.create(organizationId, locationPackageToCreate);
        expectedCreatedLocationPackage.setLocations(convertToShortDto(locationsToAdd));
        expectedCreatedLocationPackage.setIsUpdatable(true);
        expectedCreatedLocationPackage.setCreatedBy(currentUser);
        expectedCreatedLocationPackage.setUpdatedBy(null);

        //then
        assertEquals(expectedCreatedLocationPackage, createdLocationPackage);
        verify(locationPackageRepository).save(any());
        verify(orgLocationPackageRepository).save(any());
    }

    @Test
    void expectCreatesSystemListBasedLocationPackage() {
        //given
        Long organizationId = 1L;
        Organization currentUserOrganization = LocationTestUtils.createOrganization();
        currentUserOrganization.setSystem(true);
        Set<LocationFullDto> locationsToAdd = getLocationsToAdd();

        LocationPackageFullDto locationPackageToCreate = LocationTestUtils.createLocationPackageDto();
        locationPackageToCreate.setAccessType(LocationPackageAccessType.SYSTEM);
        locationPackageToCreate.setLocations(convertToShortDto(locationsToAdd));

        LocationPackageFullDto expectedCreatedLocationPackage = LocationTestUtils.createLocationPackageDto();
        expectedCreatedLocationPackage.setAccessType(LocationPackageAccessType.SYSTEM);

        //when
        when(locationPackageAssignmentService.getAssociatedLocations(any(), any())).thenReturn(convertToEntity(locationsToAdd));
        when(organizationService.findOrganizationById(organizationId)).thenReturn(currentUserOrganization);
        LocationPackageFullDto createdLocationPackage = orgLocationPackageService.create(organizationId, locationPackageToCreate);
        expectedCreatedLocationPackage.setLocations(convertToShortDto(locationsToAdd));
        expectedCreatedLocationPackage.setIsUpdatable(true);
        expectedCreatedLocationPackage.setCreatedBy(currentUser);
        expectedCreatedLocationPackage.setUpdatedBy(null);

        //then
        assertEquals(expectedCreatedLocationPackage, createdLocationPackage);
        verify(locationPackageRepository).save(any());
    }

    @Test
    void expectIllegalArgumentExceptionWhenCreatePrivateLocationPackageFromSystemOrganization() {
        //given
        Long organizationId = 1L;
        Organization currentUserOrganization = LocationTestUtils.createOrganization();
        currentUserOrganization.setSystem(true);
        LocationPackageFullDto locationPackageToCreate = LocationTestUtils.createLocationPackageDto();
        locationPackageToCreate.setAccessType(LocationPackageAccessType.PRIVATE);

        //when
        when(organizationService.findOrganizationById(organizationId)).thenReturn(currentUserOrganization);

        //then
        assertThrows(IllegalArgumentException.class, () -> orgLocationPackageService.create(organizationId, locationPackageToCreate));
    }

    @Test
    void expectIllegalArgumentExceptionWhenCreateSystemLocationPackageFromNonSystemOrganization() {
        //given
        Long organizationId = 1L;
        Organization currentUserOrganization = LocationTestUtils.createOrganization();
        currentUserOrganization.setSystem(false);
        LocationPackageFullDto locationPackageToCreate = LocationTestUtils.createLocationPackageDto();
        locationPackageToCreate.setAccessType(LocationPackageAccessType.SYSTEM);

        //when
        when(organizationService.findOrganizationById(organizationId)).thenReturn(currentUserOrganization);

        //then
        assertThrows(IllegalArgumentException.class, () -> orgLocationPackageService.create(organizationId, locationPackageToCreate));
    }

    @Test
    void expectReturnsLocationPackageById() {
        //given
        Long organizationId = 1L;
        Long locationPackageId = 1L;
        Organization currentUserOrganization = LocationTestUtils.createOrganization();
        LocationPackageFullDto expectedReturnedLocationPackage = LocationTestUtils.createLocationPackageDto();
        expectedReturnedLocationPackage.setIsUpdatable(true);

        LocationPackageEntity locationPackageEntity = locationPackageMapper.domainToEntity(expectedReturnedLocationPackage);
        OrganizationLocationPackageFunctionResult orgLocationPackageView =
            LocationTestUtils.createLocationPackageFunctionResult(currentUserOrganization, locationPackageEntity);

        //when
        when(orgLocationPackageViewRepository
            .findByByIdAndOrganizationId(locationPackageId, organizationId, LocationConstantsStorage.SYSTEM_ORGANIZATION_ID))
            .thenReturn(Optional.of(orgLocationPackageView));

        //then
        LocationPackageFullDto returnedLocationPackage = orgLocationPackageService.findById(locationPackageId, organizationId);
        assertEquals(expectedReturnedLocationPackage, returnedLocationPackage);
    }

    @Test
    void expectEntityNotFoundExceptionWhenLocationPackageNotAssociatedWithPassedOrganization() {
        //given
        Long organizationId = 1L;
        Long locationPackageId = 1L;

        //when
        when(orgLocationPackageViewRepository.findByByIdAndOrganizationId(locationPackageId, organizationId, LocationConstantsStorage.SYSTEM_ORGANIZATION_ID))
            .thenReturn(Optional.empty());

        //then
        assertThrows(EntityNotFoundException.class, () -> orgLocationPackageService.findById(locationPackageId, organizationId));
    }

    @Test
    void expectReturnsAllOrganizationPackages() {
        //given
        Long organizationId = 1L;
        Organization userOrganization = LocationTestUtils.createOrganization();

        Set<LocationShortDto> packageLocations = convertToShortDto(Set.of(LocationTestUtils.createDefaultLocation()));
        LocationPackageFullDto locationPackage = LocationTestUtils.createLocationPackageDto();
        locationPackage.setLocations(packageLocations);
        LocationPackageEntity expectedFetchedPackage = locationPackageMapper.domainToEntity(locationPackage);
        OrganizationLocationPackageFunctionResult olpView =
            LocationTestUtils.createLocationPackageFunctionResult(userOrganization, expectedFetchedPackage);

        Pageable pageable = PageRequest.of(0, 10);
        PageImpl<OrganizationLocationPackageFunctionResult> olpViewsToReturn = new PageImpl<>(List.of(olpView), pageable, 10);
        Page<LocationPackageFullDto> expectedFetchedPage = olpViewsToReturn
            .map(element -> {
                LocationPackageFullDto mappedPackage = locationPackageMapper.entityToDomain(element.getLocationPackageEntity());
                mappedPackage.setIsUpdatable(true);
                return mappedPackage;
            });

        //when
        when(orgLocationPackageViewRepository.findAllByOrganizationId(pageable, organizationId, LocationConstantsStorage.SYSTEM_ORGANIZATION_ID))
            .thenReturn(olpViewsToReturn);

        //then
        Page<LocationPackageFullDto> fetchedPackagesPage = orgLocationPackageService.getAllOrganizationPackages(pageable, organizationId);
        assertEquals(expectedFetchedPage, fetchedPackagesPage);
    }

    @Test
    void expectUpdatesPrivateListBasedLocationPackageFromNonSystemOrganization() {
        //given
        Long organizationId = 1L;
        Long locationPackageId = 1L;
        LocalDateTime updatedDate = LocalDateTime.now();

        Organization userOrganization = LocationTestUtils.createOrganization();
        userOrganization.setSystem(false);

        LocationFullDto packageLocation = LocationTestUtils.createDefaultLocation();
        packageLocation.setIsGlobal(true);
        packageLocation.setIsUpdatable(null);

        Set<LocationShortDto> newPackageLocations = convertToShortDto(Set.of(packageLocation));
        LocationPackageFullDto expectedUpdatedPackage = LocationTestUtils.createLocationPackageDto();
        expectedUpdatedPackage.setLocations(newPackageLocations);
        expectedUpdatedPackage.setName("New Package Name");
        expectedUpdatedPackage.setDescription("Updated package description");
        expectedUpdatedPackage.setCreatedBy(currentUser);
        expectedUpdatedPackage.setUpdatedBy(currentUser);
        expectedUpdatedPackage.setUpdateDate(updatedDate);
        expectedUpdatedPackage.setIsUpdatable(true);

        LocationPackageEntity locationPackageEntity = locationPackageMapper.domainToEntity(expectedUpdatedPackage);
        OrganizationLocationPackageFunctionResult olpView =
            LocationTestUtils.createLocationPackageFunctionResult(userOrganization, locationPackageEntity);

        //when
        when(orgLocationPackageViewRepository.findByByIdAndOrganizationId(locationPackageId, organizationId, LocationConstantsStorage.SYSTEM_ORGANIZATION_ID))
            .thenReturn(Optional.of(olpView));
        when(locationPackageAssignmentService.getAssociatedLocations(any(), any())).thenReturn(convertToEntity(Set.of(packageLocation)));
        when(organizationService.findOrganizationById(organizationId)).thenReturn(userOrganization);

        //then
        LocationPackageFullDto updatedPackage = orgLocationPackageService.update(locationPackageId, organizationId, expectedUpdatedPackage);
        updatedPackage.setUpdateDate(updatedDate);
        assertEquals(expectedUpdatedPackage, updatedPackage);
    }

    @Test
    void expectIllegalArgumentExceptionWhenUpdateLocationPackageAndPackageIsNotUpdatable() {
        //given
        Long organizationId = 1L;
        Long locationPackageId = 1L;
        LocalDateTime updatedDate = LocalDateTime.now();

        Organization userOrganization = LocationTestUtils.createOrganization();
        userOrganization.setSystem(false);
        LocationPackageFullDto expectedUpdatedPackage = LocationTestUtils.createLocationPackageDto();
        expectedUpdatedPackage.setUpdateDate(updatedDate);

        OrganizationLocationPackageFunctionResult olpView =
            LocationTestUtils.createLocationPackageFunctionResult(userOrganization, locationPackageMapper.domainToEntity(expectedUpdatedPackage));
        olpView.setIsUpdatable(false);

        //when
        when(orgLocationPackageViewRepository.findByByIdAndOrganizationId(locationPackageId, organizationId, LocationConstantsStorage.SYSTEM_ORGANIZATION_ID))
            .thenReturn(Optional.of(olpView));

        //then
        assertThrows(IllegalArgumentException.class, () -> orgLocationPackageService.update(locationPackageId, organizationId, expectedUpdatedPackage));
    }

    @Test
    void expectIllegalArgumentExceptionWhenUpdatePrivateLocationPackageFromSystemOrganization() {
        //given
        Long organizationId = 1L;
        Long locationPackageId = 1L;

        Organization userOrganization = LocationTestUtils.createOrganization();
        userOrganization.setSystem(true);
        LocationFullDto packageLocation = LocationTestUtils.createDefaultLocation();
        Set<LocationShortDto> newPackageLocations = convertToShortDto(Set.of(packageLocation));
        LocationPackageFullDto expectedUpdatedPackage = LocationTestUtils.createLocationPackageDto();
        expectedUpdatedPackage.setLocations(newPackageLocations);

        OrganizationLocationPackageFunctionResult olpView = LocationTestUtils.createLocationPackageFunctionResult(userOrganization, locationPackageMapper.domainToEntity(expectedUpdatedPackage));

        //when
        when(orgLocationPackageViewRepository.findByByIdAndOrganizationId(locationPackageId, organizationId, LocationConstantsStorage.SYSTEM_ORGANIZATION_ID))
            .thenReturn(Optional.of(olpView));
        when(organizationService.findOrganizationById(organizationId)).thenReturn(userOrganization);

        //then
        assertThrows(IllegalArgumentException.class, () -> orgLocationPackageService.update(locationPackageId, organizationId, expectedUpdatedPackage));
    }

    @Test
    void expectUpdatesSystemListBasedLocationPackageFromSystemOrganization() {
        //given
        Long organizationId = 1L;
        Long locationPackageId = 1L;
        LocalDateTime updatedDate = LocalDateTime.now();

        Organization userOrganization = LocationTestUtils.createOrganization();
        userOrganization.setSystem(true);
        LocationFullDto packageLocation = LocationTestUtils.createDefaultLocation();
        packageLocation.setIsUpdatable(null);

        Set<LocationShortDto> newPackageLocations = convertToShortDto(Set.of(packageLocation));
        LocationPackageFullDto expectedUpdatedPackage = LocationTestUtils.createLocationPackageDto();
        expectedUpdatedPackage.setLocations(newPackageLocations);
        expectedUpdatedPackage.setName("New Package Name");
        expectedUpdatedPackage.setDescription("Updated package description");
        expectedUpdatedPackage.setAccessType(LocationPackageAccessType.SYSTEM);
        expectedUpdatedPackage.setCreatedBy(currentUser);
        expectedUpdatedPackage.setUpdatedBy(currentUser);
        expectedUpdatedPackage.setUpdateDate(updatedDate);
        expectedUpdatedPackage.setIsUpdatable(true);

        OrganizationLocationPackageFunctionResult olpView =
            LocationTestUtils.createLocationPackageFunctionResult(userOrganization, locationPackageMapper.domainToEntity(expectedUpdatedPackage));

        //when
        when(orgLocationPackageViewRepository.findByByIdAndOrganizationId(locationPackageId, organizationId, LocationConstantsStorage.SYSTEM_ORGANIZATION_ID))
            .thenReturn(Optional.of(olpView));
        when(locationPackageAssignmentService.getAssociatedLocations(any(), any())).thenReturn(convertToEntity(Set.of(packageLocation)));
        when(organizationService.findOrganizationById(organizationId)).thenReturn(userOrganization);

        //then
        LocationPackageFullDto updatedPackage = orgLocationPackageService.update(locationPackageId, organizationId, expectedUpdatedPackage);
        updatedPackage.setUpdateDate(updatedDate);
        assertEquals(expectedUpdatedPackage, updatedPackage);
    }

    @Test
    void expectIllegalArgumentExceptionWhenUpdateSystemLocationPackageFromNonSystemOrganization() {
        //given
        Long organizationId = 1L;
        Long locationPackageId = 1L;

        Organization userOrganization = LocationTestUtils.createOrganization();
        userOrganization.setSystem(false);

        LocationFullDto packageLocation = LocationTestUtils.createDefaultLocation();
        Set<LocationShortDto> newPackageLocations = convertToShortDto(Set.of(packageLocation));
        LocationPackageFullDto expectedUpdatedPackage = LocationTestUtils.createLocationPackageDto();
        expectedUpdatedPackage.setLocations(newPackageLocations);
        expectedUpdatedPackage.setAccessType(LocationPackageAccessType.SYSTEM);

        OrganizationLocationPackageFunctionResult olpView =
            LocationTestUtils.createLocationPackageFunctionResult(userOrganization, locationPackageMapper.domainToEntity(expectedUpdatedPackage));

        //when
        when(orgLocationPackageViewRepository.findByByIdAndOrganizationId(locationPackageId, organizationId, LocationConstantsStorage.SYSTEM_ORGANIZATION_ID))
            .thenReturn(Optional.of(olpView));
        when(organizationService.findOrganizationById(organizationId)).thenReturn(userOrganization);

        //then
        assertThrows(IllegalArgumentException.class, () -> orgLocationPackageService.update(locationPackageId, organizationId, expectedUpdatedPackage));
    }

    @Test
    void expectEntityNotFoundExceptionWhenUpdateLocationPackageAndPackageNotAssociatesWithOrganization() {
        //given
        Long organizationId = 1L;
        Long locationPackageId = 1L;

        LocationFullDto packageLocation = LocationTestUtils.createDefaultLocation();
        Set<LocationShortDto> newPackageLocations = convertToShortDto(Set.of(packageLocation));
        LocationPackageFullDto expectedUpdatedPackage = LocationTestUtils.createLocationPackageDto();
        expectedUpdatedPackage.setLocations(newPackageLocations);

        //when
        when(orgLocationPackageViewRepository.findByByIdAndOrganizationId(locationPackageId, organizationId, LocationConstantsStorage.SYSTEM_ORGANIZATION_ID))
            .thenReturn(Optional.empty());

        //then
        assertThrows(EntityNotFoundException.class, () -> orgLocationPackageService.update(locationPackageId, organizationId, expectedUpdatedPackage));
    }

    @Test
    void expectDeletesLocationPackageWhenLocationPackageAssociatedWithProvidedOrganizationAndCanBeUpdatedByLoggedUser() {
        //given
        Long organizationId = 1L;
        Long locationPackageId = 1L;

        Organization userOrganization = LocationTestUtils.createOrganization();
        LocationFullDto packageLocation = LocationTestUtils.createDefaultLocation();
        Set<LocationShortDto> newPackageLocations = convertToShortDto(Set.of(packageLocation));
        LocationPackageFullDto expectedUpdatedPackage = LocationTestUtils.createLocationPackageDto();
        expectedUpdatedPackage.setLocations(newPackageLocations);
        expectedUpdatedPackage.setAccessType(LocationPackageAccessType.SYSTEM);

        OrganizationLocationPackageFunctionResult olpView =
            LocationTestUtils.createLocationPackageFunctionResult(userOrganization, locationPackageMapper.domainToEntity(expectedUpdatedPackage));

        //when
        when(orgLocationPackageViewRepository.findByByIdAndOrganizationId(locationPackageId, organizationId, LocationConstantsStorage.SYSTEM_ORGANIZATION_ID))
            .thenReturn(Optional.of(olpView));
        orgLocationPackageService.delete(locationPackageId, organizationId);

        //then
        verify(orgLocationPackageRepository).deleteByLocationPackageId(locationPackageId);
        verify(locationPackageRepository).deleteById(locationPackageId);
    }

    @Test
    void expectEntityNotFoundExceptionWhenDeleteLocationPackageAndPackageNotAssociatesWithOrganization() {
        //given
        Long organizationId = 1L;
        Long locationPackageId = 1L;

        //when
        when(orgLocationPackageViewRepository.findByByIdAndOrganizationId(locationPackageId, organizationId, LocationConstantsStorage.SYSTEM_ORGANIZATION_ID))
            .thenReturn(Optional.empty());

        //then
        assertThrows(EntityNotFoundException.class, () -> orgLocationPackageService.delete(locationPackageId, organizationId));
    }

    @Test
    void expectIllegalArgumentExceptionWhenDeleteLocationPackageAndLoggedUserHaveNoRightsToUpdateLocationPackage() {
        //given
        Long organizationId = 1L;
        Long locationPackageId = 1L;

        Organization userOrganization = LocationTestUtils.createOrganization();
        LocationFullDto packageLocation = LocationTestUtils.createDefaultLocation();
        Set<LocationShortDto> newPackageLocations = convertToShortDto(Set.of(packageLocation));
        LocationPackageFullDto expectedUpdatedPackage = LocationTestUtils.createLocationPackageDto();
        expectedUpdatedPackage.setLocations(newPackageLocations);

        OrganizationLocationPackageFunctionResult olpView =
            LocationTestUtils.createLocationPackageFunctionResult(userOrganization, locationPackageMapper.domainToEntity(expectedUpdatedPackage));
        olpView.setIsUpdatable(false);

        //when
        when(orgLocationPackageViewRepository.findByByIdAndOrganizationId(locationPackageId, organizationId, LocationConstantsStorage.SYSTEM_ORGANIZATION_ID))
            .thenReturn(Optional.of(olpView));

        //then
        assertThrows(IllegalArgumentException.class, () -> orgLocationPackageService.delete(locationPackageId, organizationId));
    }

    private Set<LocationFullDto> getLocationsToAdd() {
        return LocationTestUtils
            .createLocationsWithCustomNames(List.of("Location 1", "Location 2"))
            .stream().peek(location -> location.setIsUpdatable(null))
            .collect(Collectors.toSet());
    }

    private Set<LocationShortDto> convertToShortDto(Set<LocationFullDto> locations) {
        return locations.stream().map(locationMapper::convertToShortDto).collect(Collectors.toSet());
    }

    private Set<LocationEntity> convertToEntity(Set<LocationFullDto> locations) {
        return locations.stream().map(locationMapper::domainToEntity).collect(Collectors.toSet());
    }
}
