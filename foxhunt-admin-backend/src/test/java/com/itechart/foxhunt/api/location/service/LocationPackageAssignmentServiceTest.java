package com.itechart.foxhunt.api.location.service;

import com.itechart.foxhunt.api.location.dao.LocationPackageRepository;
import com.itechart.foxhunt.api.location.dao.OrganizationLocationFunctionRepository;
import com.itechart.foxhunt.api.location.dao.OrganizationLocationPackageFunctionRepository;
import com.itechart.foxhunt.api.location.mapper.*;
import com.itechart.foxhunt.api.location.util.LocationTestUtils;
import com.itechart.foxhunt.api.organization.Organization;
import com.itechart.foxhunt.api.user.mapper.UserMapperImpl;
import com.itechart.foxhunt.domain.entity.UserEntity;
import com.itechart.foxhunt.domain.entity.location.LocationEntity;
import com.itechart.foxhunt.domain.entity.location.LocationPackageEntity;
import com.itechart.foxhunt.domain.entity.location.function.OrganizationLocationFunctionResult;
import com.itechart.foxhunt.domain.entity.location.function.OrganizationLocationPackageFunctionResult;
import com.itechart.foxhunt.domain.enums.LocationPackageAssignmentType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static com.itechart.foxhunt.api.location.service.LocationConstantsStorage.SYSTEM_ORGANIZATION_ID;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith({MockitoExtension.class, SpringExtension.class})
@ContextConfiguration(classes = {
    LocationPackageMapperImpl.class, LocationMapperImpl.class,
    ForbiddenAreaMapperImpl.class, UserMapperImpl.class,
    LocationPackageAssignmentServiceImpl.class
})
@MockitoSettings(strictness = Strictness.LENIENT)
public class LocationPackageAssignmentServiceTest {

    @MockBean
    OrganizationLocationPackageFunctionRepository olpRepository;

    @MockBean
    OrganizationLocationFunctionRepository locationRepository;

    @MockBean
    LocationPackageRepository locationPackageRepository;

    @Autowired
    LocationMapper locationMapper;

    @Autowired
    LocationPackageMapper locationPackageMapper;

    @Autowired
    LocationPackageAssignmentService packageUpdateService;

    UserEntity currentUser;

    @BeforeEach
    public void setUp() {
        currentUser = new UserEntity();
        currentUser.setId(1L);
    }

    @Test
    public void expectRefreshPackagesAccordingToLocationChanges() {
        //given
        Long organizationId = 1L;
        Organization packageOrganization = LocationTestUtils.createOrganization();

        LocationEntity updatedLocation = locationMapper.domainToEntity(LocationTestUtils.createDefaultLocation());
        updatedLocation.setCreatedBy(currentUser);
        LocationPackageEntity locationPackageToUpdate = locationPackageMapper.domainToEntity(LocationTestUtils.createLocationPackageDto());
        OrganizationLocationPackageFunctionResult olpViewToUpdate =
            LocationTestUtils.createLocationPackageFunctionResult(packageOrganization, locationPackageToUpdate);

        //when
        when(olpRepository.findPackagesForLocationInclusion(organizationId, SYSTEM_ORGANIZATION_ID, updatedLocation.getCoordinates()))
            .thenReturn(List.of(olpViewToUpdate));

        //then
        packageUpdateService.refreshAssociatedLocationPackages(organizationId, updatedLocation, currentUser);
        verify(olpRepository).findPackagesForLocationInclusion(any(), any(), any());
        verify(olpRepository).findPackagesForLocationExclusion(any(), any(), any());
        verify(locationPackageRepository).saveAll(any());
    }

    @Test
    public void expectDeletesLocationFromAllPackages() {
        //given
        Long locationId = 1L;

        //when
        packageUpdateService.deleteLocationPackagesCascade(locationId);

        //then
        verify(locationPackageRepository).deleteLocationFromLocationPackages(locationId);
    }

    @Test
    public void expectReturnsAllLocationsInsideAreaBasedPackageCoordinatesWhenExactAreaMatch() {
        //given
        Long organizationId = 1L;
        Set<LocationEntity> expectedReturnedLocations = LocationTestUtils
            .createLocationsWithCustomNames(List.of("Red carpets", "Wild forest"))
            .stream().map(locationMapper::domainToEntity)
            .collect(Collectors.toSet());
        LocationPackageEntity locationPackageEntity = locationPackageMapper.domainToEntity(LocationTestUtils.createLocationPackageDto());
        locationPackageEntity.setAssignmentType(LocationPackageAssignmentType.AREA_BASED);
        locationPackageEntity.setExactAreaMatch(true);

        //when
        when(locationRepository.findOrganizationLocationsInsideArea(any(), any(), any()))
            .thenReturn(convertToOrganizationLocation(expectedReturnedLocations));

        //then
        Set<LocationEntity> returnedLocations = packageUpdateService.getAssociatedLocations(locationPackageEntity, organizationId);
        assertEquals(expectedReturnedLocations, returnedLocations);
    }

    @Test
    public void expectReturnsAllLocationsInterceptsAreaBasedPackagesCoordinatesWhenNotExactAreaMatch() {
        //given
        Long organizationId = 1L;
        Set<LocationEntity> expectedReturnedLocations = LocationTestUtils
            .createLocationsWithCustomNames(List.of("Red carpets", "Wild forest", "Wild Forest", "Zelenoye"))
            .stream().map(locationMapper::domainToEntity)
            .collect(Collectors.toSet());
        LocationPackageEntity locationPackageEntity = locationPackageMapper.domainToEntity(LocationTestUtils.createLocationPackageDto());
        locationPackageEntity.setAssignmentType(LocationPackageAssignmentType.AREA_BASED);
        locationPackageEntity.setExactAreaMatch(false);

        //when
        when(locationRepository.findOrganizationLocationsIntersectingArea(any(), any(), any()))
            .thenReturn(convertToOrganizationLocation(expectedReturnedLocations));

        //then
        Set<LocationEntity> returnedLocations = packageUpdateService.getAssociatedLocations(locationPackageEntity, organizationId);
        assertEquals(expectedReturnedLocations, returnedLocations);
    }

    @Test
    public void expectReturnsAllLocationAssociatedWithProvidedListBasedPackage() {
        Long organizationId = 1L;
        Set<LocationEntity> expectedReturnedLocations = LocationTestUtils
            .createLocationsWithCustomNames(List.of("Location 1", "Location 2", "Red carpets", "Wild forest", "Wild Forest", "Zelenoye"))
            .stream().map(locationMapper::domainToEntity)
            .collect(Collectors.toSet());
        List<Long> locationsIds = expectedReturnedLocations.stream().map(LocationEntity::getId).toList();
        LocationPackageEntity locationPackageEntity = locationPackageMapper.domainToEntity(LocationTestUtils.createLocationPackageDto());
        locationPackageEntity.setLocations(expectedReturnedLocations);
        locationPackageEntity.setExactAreaMatch(true);

        //when
        Set<OrganizationLocationFunctionResult> locationFromDb = convertToOrganizationLocation(expectedReturnedLocations);
        when(locationRepository.findLocationsByLocationIdsAndOrganizationId(
            argThat(passedIds -> passedIds.containsAll(locationsIds)),
            eq(organizationId),
            eq(SYSTEM_ORGANIZATION_ID))
        ).thenReturn(locationFromDb);

        //then
        Set<LocationEntity> returnedLocations = packageUpdateService.getAssociatedLocations(locationPackageEntity, organizationId);
        assertEquals(expectedReturnedLocations, returnedLocations);
    }

    private Set<OrganizationLocationFunctionResult> convertToOrganizationLocation(Set<LocationEntity> locationEntities) {
        return locationEntities.stream().map(entity -> {
            OrganizationLocationFunctionResult organizationLocation = new OrganizationLocationFunctionResult();
            organizationLocation.setLocationEntity(entity);
            return organizationLocation;
        }).collect(Collectors.toSet());
    }
}
