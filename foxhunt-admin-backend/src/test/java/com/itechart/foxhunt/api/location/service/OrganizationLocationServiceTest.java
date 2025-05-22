package com.itechart.foxhunt.api.location.service;

import com.itechart.foxhunt.api.auth.security.LoggedUserService;
import com.itechart.foxhunt.api.core.OrganizationId;
import com.itechart.foxhunt.api.exception.BadRequestException;
import com.itechart.foxhunt.api.location.dao.LocationRepository;
import com.itechart.foxhunt.api.location.dao.OrganizationLocationFunctionRepository;
import com.itechart.foxhunt.api.location.dao.OrganizationLocationRepository;
import com.itechart.foxhunt.api.location.dto.LocationFullDto;
import com.itechart.foxhunt.api.location.mapper.ForbiddenAreaMapperImpl;
import com.itechart.foxhunt.api.location.mapper.LocationMapper;
import com.itechart.foxhunt.api.location.mapper.LocationMapperImpl;
import com.itechart.foxhunt.api.location.util.LocationTestUtils;
import com.itechart.foxhunt.api.organization.Organization;
import com.itechart.foxhunt.api.organization.OrganizationService;
import com.itechart.foxhunt.api.user.dto.User;
import com.itechart.foxhunt.api.user.mapper.UserMapper;
import com.itechart.foxhunt.api.user.mapper.UserMapperImpl;
import com.itechart.foxhunt.domain.entity.OrganizationLocationCompositePK;
import com.itechart.foxhunt.domain.entity.UserEntity;
import com.itechart.foxhunt.domain.entity.location.LocationEntity;
import com.itechart.foxhunt.domain.entity.location.function.OrganizationLocationFunctionResult;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.*;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import javax.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith({MockitoExtension.class, SpringExtension.class})
@ContextConfiguration(classes = {
    LocationMapperImpl.class, UserMapperImpl.class,
    ForbiddenAreaMapperImpl.class, OrganizationLocationServiceImpl.class
})
@MockitoSettings(strictness = Strictness.LENIENT)
public class OrganizationLocationServiceTest {

    @MockBean
    LocationRepository locationRepository;

    @MockBean
    OrganizationLocationRepository organizationLocationRepository;

    @MockBean
    OrganizationLocationFunctionRepository organizationLocationFunctionRepository;

    @MockBean
    OrganizationService organizationService;

    @MockBean
    LocationPackageAssignmentService locationPackageAssignmentService;

    @MockBean
    LoggedUserService loggedUserService;

    @Autowired
    UserMapper userMapper;

    @Autowired
    LocationMapper locationMapper;

    @Autowired
    OrganizationLocationService organizationLocationService;

    Sort sortingByName = Sort.by("name");

    UserEntity loggedUserEntity;
    User loggedUser;

    @BeforeEach
    void setUp() {
        loggedUserEntity = new UserEntity();
        loggedUserEntity.setId(1L);
        loggedUserEntity.setFirstName("Petya");
        loggedUserEntity.setLastName("Utockhin");
        loggedUserEntity.setEmail("1123@gmail.com");

        loggedUser = userMapper.entityToDomain(loggedUserEntity);

        when(loggedUserService.getLoggedUserEntity()).thenReturn(loggedUserEntity);
    }

    @Test
    void expectCreatesGlobalLocationFromSystemOrganization() {
        //given
        Long organizationId = 1L;
        Organization organization = LocationTestUtils.createOrganization();
        organization.setSystem(true);

        LocationFullDto expectedCreatedLocation = LocationTestUtils.createDefaultLocation();
        expectedCreatedLocation.setIsGlobal(true);
        expectedCreatedLocation.setIsUpdatable(true);
        expectedCreatedLocation.setIsCloned(false);

        User expectedCreatedBy = new User();
        expectedCreatedBy.setId(1L);
        expectedCreatedBy.setFirstName("Petya");
        expectedCreatedBy.setLastName("Utockhin");
        expectedCreatedBy.setEmail("1123@gmail.com");
        expectedCreatedLocation.setCreatedBy(expectedCreatedBy);

        //when
        when(organizationService.findOrganizationById(organizationId)).thenReturn(organization);
        when(locationRepository.save(any())).thenReturn(locationMapper.domainToEntity(expectedCreatedLocation));
        when(locationRepository.isAreaWithinEarthCoordinates(any())).thenReturn(true);

        //then
        assertEquals(expectedCreatedLocation, organizationLocationService.create(organizationId, expectedCreatedLocation, loggedUser));
        verify(locationPackageAssignmentService).refreshAssociatedLocationPackages(any(), any(), any());
    }

    @Test
    void expectCreatesPrivateLocationFromNonSystemOrganization() {
        //given
        Long organizationId = 1L;
        Organization organization = LocationTestUtils.createOrganization();
        organization.setSystem(false);

        LocationFullDto expectedCreatedLocation = LocationTestUtils.createDefaultLocation();
        expectedCreatedLocation.setIsUpdatable(true);
        expectedCreatedLocation.setIsCloned(false);

        User expectedCreatedBy = new User();
        expectedCreatedBy.setId(1L);
        expectedCreatedBy.setFirstName("Petya");
        expectedCreatedBy.setLastName("Utockhin");
        expectedCreatedBy.setEmail("1123@gmail.com");
        expectedCreatedLocation.setCreatedBy(expectedCreatedBy);

        //when
        when(locationRepository.save(any())).thenReturn(locationMapper.domainToEntity(expectedCreatedLocation));
        when(locationRepository.isAreaWithinEarthCoordinates(any())).thenReturn(true);
        when(organizationService.findOrganizationById(organizationId)).thenReturn(organization);

        //then
        assertEquals(expectedCreatedLocation, organizationLocationService.create(organizationId, expectedCreatedLocation, loggedUser));
        verify(organizationLocationRepository).save(any());
        verify(locationPackageAssignmentService).refreshAssociatedLocationPackages(any(), any(), any());
    }

    @Test
    void expectBadRequestExceptionWhenCreatesLocationAndLocationAreaNotWithinEarthCoordinates() {
        //given
        Long organizationId = 1L;
        LocationFullDto expectedCreatedLocation = LocationTestUtils.createDefaultLocation();

        //when
        when(locationRepository.isAreaWithinEarthCoordinates(any())).thenReturn(false);

        //then
        assertThrows(BadRequestException.class, () -> organizationLocationService.create(organizationId, expectedCreatedLocation, loggedUser));
    }

    @Test
    void expectReturnsLocationByIdThatAssociatesWithSpecifiedOrganization() {
        //given
        Long organizationId = 1L;
        Long locationId = 1L;
        LocationFullDto expectedFetchedLocation = LocationTestUtils.createDefaultLocation();
        expectedFetchedLocation.setIsUpdatable(true);
        expectedFetchedLocation.setIsGlobal(true);
        expectedFetchedLocation.setIsCloned(false);

        LocationEntity locationEntity = locationMapper.domainToEntity(expectedFetchedLocation);
        OrganizationLocationFunctionResult expectedOrganizationLocation =
            createOrganizationLocationFunctionResult(organizationId, locationEntity);
        expectedOrganizationLocation.setIsUpdatable(true);
        expectedOrganizationLocation.setIsGlobal(true);

        //when
        when(organizationLocationFunctionRepository
            .findOrganizationLocationByLocationIdAndOrganizationId(locationId, organizationId, LocationConstantsStorage.SYSTEM_ORGANIZATION_ID))
            .thenReturn(Optional.of(expectedOrganizationLocation));
        when(locationRepository.isAreaWithinEarthCoordinates(any())).thenReturn(true);

        //then
        assertEquals(expectedFetchedLocation, organizationLocationService.findByIdAndOrganizationId(locationId, organizationId));
    }

    @Test
    void expectEntityNotFoundExceptionWhenGetLocationByIdAndLocationIsNotAssociatesWithOrganization() {
        //given
        Long organizationId = 1L;
        Long locationId = 1L;

        //when
        when(organizationLocationFunctionRepository
            .findOrganizationLocationByLocationIdAndOrganizationId(locationId, organizationId, LocationConstantsStorage.SYSTEM_ORGANIZATION_ID))
            .thenReturn(Optional.empty());

        //then
        assertThrows(EntityNotFoundException.class, () -> organizationLocationService.findByIdAndOrganizationId(locationId, organizationId));
    }

    @Test
    void expectReturnsAllLocationsSortedByName() {
        //given
        OrganizationId organizationId = new OrganizationId(1L);
        List<String> locationsNames = List.of("Wild forest", "Red carpets", "Zelyonoe", "Детская Железная Дорога",
            "Зеленое", "Парк Дружбы Народов", "Парк Победы", "Парк Челюскинцев");
        List<LocationFullDto> expectedFetchedLocations = LocationTestUtils.createLocationsWithCustomNames(locationsNames);
        expectedFetchedLocations.forEach(location -> {
            location.setIsUpdatable(true);
            location.setIsGlobal(true);
            location.setIsCloned(false);
        });

        Pageable pageable = PageRequest.of(0, expectedFetchedLocations.size(), sortingByName);
        PageImpl<LocationFullDto> expectedLocationsPage = new PageImpl<>(expectedFetchedLocations, pageable, expectedFetchedLocations.size());

        //when
        List<OrganizationLocationFunctionResult> orgLocationViews = expectedFetchedLocations.stream().map(location -> {
            LocationEntity locationEntity = locationMapper.domainToEntity(location);
            OrganizationLocationFunctionResult organizationLocation =
                createOrganizationLocationFunctionResult(organizationId.getId(), locationEntity);
            organizationLocation.setIsUpdatable(true);
            organizationLocation.setIsGlobal(true);
            return organizationLocation;
        }).collect(Collectors.toList());
        PageImpl<OrganizationLocationFunctionResult> expectedOrganizationLocations = new PageImpl<>(orgLocationViews, pageable, orgLocationViews.size());
        when(organizationLocationFunctionRepository.findAllByOrganizationId(organizationId.getId(), LocationConstantsStorage.SYSTEM_ORGANIZATION_ID, pageable))
            .thenReturn(expectedOrganizationLocations);

        //then
        Page<LocationFullDto> fetchedLocations = organizationLocationService
            .getAll(organizationId.getId(), pageable);
        assertEquals(expectedLocationsPage.getContent(), fetchedLocations.getContent());
    }

    @Test
    void expectReturnsAllFavoriteLocationsSortedByName() {
        //given
        OrganizationId organizationId = new OrganizationId(1L);
        List<String> locationsNames = List.of("Зеленое", "Парк Дружбы Народов", "Парк Победы", "Парк Челюскинцев");
        List<LocationFullDto> expectedFetchedLocations = LocationTestUtils.createLocationsWithCustomNames(locationsNames);
        expectedFetchedLocations.forEach(location -> {
            location.setIsUpdatable(true);
            location.setIsGlobal(true);
            location.setIsFavorite(true);
            location.setIsCloned(false);
        });

        Pageable pageable = PageRequest.of(0, expectedFetchedLocations.size(), sortingByName);

        //when
        List<OrganizationLocationFunctionResult> orgLocationViews = expectedFetchedLocations.stream().map(location -> {
            LocationEntity locationEntity = locationMapper.domainToEntity(location);
            OrganizationLocationFunctionResult organizationLocation =
                createOrganizationLocationFunctionResult(organizationId.getId(), locationEntity);
            organizationLocation.setIsUpdatable(location.getIsUpdatable());
            organizationLocation.setIsGlobal(location.getIsGlobal());
            organizationLocation.setIsFavorite(location.getIsFavorite());
            return organizationLocation;
        }).collect(Collectors.toList());

        //then
        PageImpl<OrganizationLocationFunctionResult> expectedOrganizationLocations = new PageImpl<>(orgLocationViews, pageable, orgLocationViews.size());
        when(organizationLocationFunctionRepository.findAllFavoriteByOrganizationId(organizationId.getId(), LocationConstantsStorage.SYSTEM_ORGANIZATION_ID, pageable))
            .thenReturn(expectedOrganizationLocations);

        //then
        List<LocationFullDto> fetchedLocations = organizationLocationService
            .getAllFavorite(organizationId.getId(), pageable);
        assertEquals(expectedFetchedLocations, fetchedLocations);
    }

    @Test
    void expectReturnsAllLocationsFilteredByNameAndSortedByName() {
        //given
        String locationName = "Д";
        OrganizationId organizationId = new OrganizationId(1L);
        List<String> locationsNames = List.of("Детская Железная Дорога", "Парк Дружбы Народов");
        List<LocationFullDto> expectedFetchedLocations = LocationTestUtils.createLocationsWithCustomNames(locationsNames);
        expectedFetchedLocations.forEach(location -> {
            location.setIsGlobal(false);
            location.setIsUpdatable(true);
            location.setIsCloned(false);
        });

        Pageable pageable = PageRequest.of(0, expectedFetchedLocations.size(), sortingByName);
        PageImpl<LocationFullDto> expectedLocationsPage = new PageImpl<>(expectedFetchedLocations, pageable, expectedFetchedLocations.size());

        //when
        List<OrganizationLocationFunctionResult> orgLocationViews = expectedFetchedLocations.stream().map(location -> {
            LocationEntity locationEntity = locationMapper.domainToEntity(location);
            OrganizationLocationFunctionResult organizationLocation =
                createOrganizationLocationFunctionResult(organizationId.getId(), locationEntity);
            organizationLocation.setIsGlobal(false);
            organizationLocation.setIsUpdatable(true);
            return organizationLocation;
        }).collect(Collectors.toList());
        PageImpl<OrganizationLocationFunctionResult> expectedOrganizationLocations = new PageImpl<>(orgLocationViews, pageable, orgLocationViews.size());
        when(organizationLocationFunctionRepository.searchByLocationNameAndOrganization(pageable, LocationConstantsStorage.SYSTEM_ORGANIZATION_ID, organizationId.getId(), locationName)).thenReturn(expectedOrganizationLocations);

        //then
        Page<LocationFullDto> fetchedLocations = organizationLocationService.getAllByLocationName(organizationId.getId(), pageable, locationName);
        assertEquals(expectedLocationsPage, fetchedLocations);
    }

    @Test
    void expectUpdatesLocationWhenLocationIsUpdatable() {
        //given
        Long locationId = 1L;
        Long organizationId = 1L;
        LocationFullDto expectedUpdatedLocation = LocationTestUtils.createDefaultLocation();
        LocationEntity locationEntity = locationMapper.domainToEntity(expectedUpdatedLocation);

        expectedUpdatedLocation.setName("New Location Name");
        expectedUpdatedLocation.setIsUpdatable(true);
        expectedUpdatedLocation.setUpdatedDate(LocalDateTime.now());
        expectedUpdatedLocation.setIsCloned(false);

        //when
        OrganizationLocationFunctionResult organizationLocation = createOrganizationLocationFunctionResult(organizationId, locationEntity);
        organizationLocation.setIsUpdatable(true);
        Optional<OrganizationLocationFunctionResult> fetchedOrgLocationView = Optional
            .of(organizationLocation);
        when(organizationLocationFunctionRepository.findOrganizationLocationByLocationIdAndOrganizationId(locationId, organizationId, LocationConstantsStorage.SYSTEM_ORGANIZATION_ID))
            .thenReturn(fetchedOrgLocationView);
        LocationEntity savedLocation = locationMapper.domainToEntity(expectedUpdatedLocation);
        when(locationRepository.save(any())).thenReturn(savedLocation);
        when(locationRepository.isAreaWithinEarthCoordinates(any())).thenReturn(true);

        //then
        LocationFullDto updatedLocation = organizationLocationService.update(locationId, organizationId, expectedUpdatedLocation);
        verify(locationRepository).isAreaMatchesToLocation(any(), any());
        assertEquals(expectedUpdatedLocation, updatedLocation);
    }

    @Test
    void expectIllegalArgumentExceptionWhenUpdatesNonUpdatableLocation() {
        //given
        Long locationId = 1L;
        Long organizationId = 1L;
        LocationFullDto expectedUpdatedLocation = LocationTestUtils.createDefaultLocation();
        LocationEntity locationEntity = locationMapper.domainToEntity(expectedUpdatedLocation);

        expectedUpdatedLocation.setName("New Location Name");
        expectedUpdatedLocation.setUpdatedDate(LocalDateTime.now());

        //when
        OrganizationLocationFunctionResult organizationLocation = createOrganizationLocationFunctionResult(organizationId, locationEntity);
        organizationLocation.setIsUpdatable(false);
        Optional<OrganizationLocationFunctionResult> fetchedOrgLocationView = Optional
            .of(organizationLocation);
        when(organizationLocationFunctionRepository.findOrganizationLocationByLocationIdAndOrganizationId(locationId, organizationId, LocationConstantsStorage.SYSTEM_ORGANIZATION_ID))
            .thenReturn(fetchedOrgLocationView);
        LocationEntity savedLocation = locationMapper.domainToEntity(expectedUpdatedLocation);
        when(locationRepository.save(any())).thenReturn(savedLocation);
        when(locationRepository.isAreaWithinEarthCoordinates(any())).thenReturn(true);

        //then
        assertThrows(IllegalArgumentException.class, () -> organizationLocationService.update(locationId, organizationId, expectedUpdatedLocation));
    }

    @Test
    void expectBadRequestExceptionWhenUpdatesLocationAreaAndAreaNotWithinEarthCoordinates() {
        //given
        Long locationId = 1L;
        Long organizationId = 1L;
        LocationFullDto expectedUpdatedLocation = LocationTestUtils.createDefaultLocation();
        LocationEntity locationEntity = locationMapper.domainToEntity(expectedUpdatedLocation);

        expectedUpdatedLocation.setName("New Location Name");
        expectedUpdatedLocation.setIsUpdatable(true);
        expectedUpdatedLocation.setUpdatedDate(LocalDateTime.now());

        //when
        OrganizationLocationFunctionResult organizationLocation = createOrganizationLocationFunctionResult(organizationId, locationEntity);
        organizationLocation.setIsUpdatable(true);
        Optional<OrganizationLocationFunctionResult> fetchedOrgLocationView = Optional
            .of(organizationLocation);
        when(organizationLocationFunctionRepository.findOrganizationLocationByLocationIdAndOrganizationId(locationId, organizationId, LocationConstantsStorage.SYSTEM_ORGANIZATION_ID))
            .thenReturn(fetchedOrgLocationView);
        LocationEntity savedLocation = locationMapper.domainToEntity(expectedUpdatedLocation);
        when(locationRepository.save(any())).thenReturn(savedLocation);
        when(locationRepository.isAreaWithinEarthCoordinates(any())).thenReturn(false);

        //then
        assertThrows(BadRequestException.class, () -> organizationLocationService.update(locationId, organizationId, expectedUpdatedLocation));
    }

    @Test
    void expectEntityNotFoundExceptionWhenUpdateLocationAndLocationNotAssociatesWithOrganization() {
        //given
        Long organizationId = 1L;
        Long locationId = 1L;
        LocationFullDto newLocation = LocationTestUtils.createDefaultLocation();

        //when
        when(organizationLocationFunctionRepository.findOrganizationLocationByLocationIdAndOrganizationId(locationId, organizationId, LocationConstantsStorage.SYSTEM_ORGANIZATION_ID))
            .thenReturn(Optional.empty());
        when(locationRepository.isAreaWithinEarthCoordinates(any())).thenReturn(true);

        //then
        assertThrows(EntityNotFoundException.class, () -> organizationLocationService.update(locationId, organizationId, newLocation));
    }

    @Test
    void expectBadRequestExceptionWhenUpdateLocationAndLocationNameNotUnique() {
        //given
        Long organizationId = 1L;
        Long locationId = 1L;
        LocationFullDto updateLocation = LocationTestUtils.createDefaultLocation();

        //when
        when(organizationLocationRepository.existsByOrganizationAnLocationName(organizationId, updateLocation.getName()))
            .thenReturn(true);

        //then
        assertThrows(BadRequestException.class, () -> organizationLocationService.update(locationId, organizationId, updateLocation));
    }

    @Test
    void expectedDeleteLocationWhenLocationAssociatesWithOrganization() {
        //given
        Long organizationId = 1L;
        Long locationId = 1L;
        LocationEntity locationEntity = locationMapper.domainToEntity(LocationTestUtils.createDefaultLocation());
        OrganizationLocationFunctionResult organizationLocation = createOrganizationLocationFunctionResult(organizationId, locationEntity);
        organizationLocation.setIsUpdatable(true);
        Optional<OrganizationLocationFunctionResult> orgLocationView = Optional
            .of(organizationLocation);

        //when
        when(organizationLocationFunctionRepository.findOrganizationLocationByLocationIdAndOrganizationId(locationId, organizationId, LocationConstantsStorage.SYSTEM_ORGANIZATION_ID))
            .thenReturn(orgLocationView);

        //then
        organizationLocationService.delete(locationId, organizationId);
        verify(locationPackageAssignmentService).deleteLocationPackagesCascade(any());
        verify(organizationLocationRepository).deleteByLocationId(locationId);
        verify(locationRepository).deleteById(locationId);
    }

    @Test
    void expectEntityNotFoundExceptionWhenDeleteLocationAndLocationNotAssociatesWithOrganization() {
        //given
        Long organizationId = 1L;
        Long locationId = 1L;

        //when
        when(organizationLocationFunctionRepository.findOrganizationLocationByLocationIdAndOrganizationId(locationId, organizationId, LocationConstantsStorage.SYSTEM_ORGANIZATION_ID))
            .thenReturn(Optional.empty());

        //then
        assertThrows(EntityNotFoundException.class, () -> organizationLocationService.delete(locationId, organizationId));
    }

    @Test
    void expectAddsLocationToFavoritesWhenLocationAssociatesWithOrganization() {
        //given
        Long organizationId = 1L;
        Long locationId = 1L;
        LocationEntity locationEntity = locationMapper.domainToEntity(LocationTestUtils.createDefaultLocation());
        OrganizationLocationFunctionResult orgLocationView = createOrganizationLocationFunctionResult(organizationId, locationEntity);
        orgLocationView.setIsUpdatable(true);
        orgLocationView.setIsFavorite(false);

        //when
        when(organizationLocationFunctionRepository.findOrganizationLocationByLocationIdAndOrganizationId(locationId, organizationId, LocationConstantsStorage.SYSTEM_ORGANIZATION_ID))
            .thenReturn(Optional.of(orgLocationView));

        //then
        organizationLocationService.toggleFavorite(locationId, organizationId);
        verify(organizationLocationRepository).addLocationToFavorite(organizationId, locationId);
    }

    @Test
    void expectRemovesLocationFromFavoritesWhenLocationAssociatesWithOrganization() {
        //given
        Long organizationId = 1L;
        Long locationId = 1L;
        LocationEntity locationEntity = locationMapper.domainToEntity(LocationTestUtils.createDefaultLocation());
        OrganizationLocationFunctionResult orgLocationView = createOrganizationLocationFunctionResult(organizationId, locationEntity);
        orgLocationView.setIsUpdatable(true);
        orgLocationView.setIsFavorite(true);

        //when
        when(organizationLocationFunctionRepository.findOrganizationLocationByLocationIdAndOrganizationId(locationId, organizationId, LocationConstantsStorage.SYSTEM_ORGANIZATION_ID))
            .thenReturn(Optional.of(orgLocationView));

        //then
        organizationLocationService.toggleFavorite(locationId, organizationId);
        verify(organizationLocationRepository).removeLocationFromFavorite(organizationId, locationId);
    }

    @Test
    void expectEntityNotFoundExceptionWhenToggleFavoriteLocationThatNotAssociatesWithOrganization() {
        //given
        Long organizationId = 1L;
        Long locationId = 1L;

        //when
        when(organizationLocationFunctionRepository.findOrganizationLocationByLocationIdAndOrganizationId(locationId, organizationId, LocationConstantsStorage.SYSTEM_ORGANIZATION_ID))
            .thenReturn(Optional.empty());

        //then
        assertThrows(EntityNotFoundException.class, () -> organizationLocationService.toggleFavorite(locationId, organizationId));
    }

    private OrganizationLocationFunctionResult createOrganizationLocationFunctionResult(Long organizationId, LocationEntity location) {
        OrganizationLocationFunctionResult organizationLocation = new OrganizationLocationFunctionResult();
        organizationLocation.setId(new OrganizationLocationCompositePK(organizationId, location.getId()));
        organizationLocation.setLocationEntity(location);
        return organizationLocation;
    }

}
