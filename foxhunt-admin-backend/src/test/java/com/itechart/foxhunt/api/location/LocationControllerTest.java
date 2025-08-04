package com.itechart.foxhunt.api.location;

import com.itechart.foxhunt.api.auth.security.LoggedUserService;
import com.itechart.foxhunt.api.core.OrganizationId;
import com.itechart.foxhunt.api.location.dto.LocationFullDto;
import com.itechart.foxhunt.api.location.dto.LocationShortDto;
import com.itechart.foxhunt.api.location.mapper.ForbiddenAreaMapperImpl;
import com.itechart.foxhunt.api.location.mapper.LocationMapper;
import com.itechart.foxhunt.api.location.mapper.LocationMapperImpl;
import com.itechart.foxhunt.api.location.service.OrganizationLocationService;
import com.itechart.foxhunt.api.location.util.LocationTestUtils;
import com.itechart.foxhunt.api.user.dto.User;
import com.itechart.foxhunt.api.user.mapper.UserMapperImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.List;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;

@ExtendWith({MockitoExtension.class, SpringExtension.class})
@ContextConfiguration(classes = {
    LocationMapperImpl.class, ForbiddenAreaMapperImpl.class,
    UserMapperImpl.class, LocationControllerImpl.class
})
@MockitoSettings(strictness = Strictness.LENIENT)
public class LocationControllerTest {

    @MockBean
    OrganizationLocationService organizationLocationService;
 
    @MockBean
    LoggedUserService loggedUserService;

    @Autowired
    LocationControllerImpl locationController;

    @Autowired
    LocationMapper locationMapper;

    Sort sortingByName = Sort.by("name");

    @Test
    void expectCreateLocationWhenLocationIsValid() {
        //given
        User loggedUser = new User();
        loggedUser.setId(1L);
        loggedUser.setFirstName("Petya");
        loggedUser.setLastName("Utochkin");
        loggedUser.setEmail("1123@gmail.com");

        LocationFullDto locationToCreate = LocationTestUtils.createDefaultLocation();
        OrganizationId organizationId = new OrganizationId(1L);

        //when
        when(organizationLocationService.create(organizationId.getId(), locationToCreate, loggedUser)).thenReturn(locationToCreate);
        when(loggedUserService.getLoggedUser()).thenReturn(loggedUser);

        //then
        ResponseEntity<LocationFullDto> createdLocationResponse = locationController.createLocation(locationToCreate, organizationId);
        assertEquals(new ResponseEntity<>(locationToCreate, HttpStatus.CREATED), createdLocationResponse);
    }

    @Test
    void expectGetLocationWhenLocationAssociatesWithOrganization() {
        //given
        LocationFullDto expectedFetchedLocation = LocationTestUtils.createDefaultLocation();
        OrganizationId organizationId = new OrganizationId(1L);
        Long locationId = 1L;

        //when
        when(organizationLocationService.findByIdAndOrganizationId(locationId, organizationId.getId())).thenReturn(expectedFetchedLocation);

        //then
        LocationFullDto fetchedLocation = locationController.getLocationById(locationId, organizationId);
        assertEquals(expectedFetchedLocation, fetchedLocation);
    }

    @Test
    void expectIllegalArgumentExceptionWhenGetLocationAndNotAssociatesWithOrganization() {
        //given
        OrganizationId organizationId = new OrganizationId(1L);
        Long notExistingLocationId = 1000L;

        //when
        when(organizationLocationService.findByIdAndOrganizationId(notExistingLocationId, organizationId.getId()))
            .thenThrow(new IllegalArgumentException());

        //then
        assertThrows(IllegalArgumentException.class, () -> locationController.getLocationById(notExistingLocationId, organizationId));
    }

    @Test
    void expectGetAllOrganizationLocationsSortedByName() {
        //given
        OrganizationId organizationId = new OrganizationId(1L);

        List<String> locationsNames = List.of("Red carpets", "Wild forest", "Zelyonoe", "Детская Железная Дорога", "Зеленое", "Парк Дружбы Народов", "Парк Победы", "Парк Челюскинцев");
        List<LocationFullDto> locationsWithCustomNames = getLocationsWithCustomNames(locationsNames);

        Pageable pageable = PageRequest.of(0, locationsWithCustomNames.size(), sortingByName);
        PageImpl<LocationFullDto> orgLocationsPage = new PageImpl<>(locationsWithCustomNames, pageable, locationsWithCustomNames.size());
        Page<LocationShortDto> expectedOrgLocationsPage = orgLocationsPage.map(locationMapper::convertToShortDto);

        //when
        when(organizationLocationService.getAll(organizationId.getId(), pageable)).thenReturn(orgLocationsPage);

        //then
        ResponseEntity<Page<LocationShortDto>> organizationLocations = locationController
            .getAllOrganizationLocations(pageable, organizationId);
        assertEquals(ResponseEntity.ok(expectedOrgLocationsPage), organizationLocations);
    }

    @Test
    void expectGetOrganizationLocationByNameAndSortedByName() {
        //given
        OrganizationId organizationId = new OrganizationId(1L);
        List<String> locationsNames = List.of("Парк Дружбы Народов", "Парк Победы");
        List<LocationFullDto> locationsWithCustomNames = getLocationsWithCustomNames(locationsNames);

        Pageable pageable = PageRequest.of(0, locationsWithCustomNames.size(), sortingByName);
        Page<LocationFullDto> orgLocationsPage = new PageImpl<>(locationsWithCustomNames, pageable, locationsWithCustomNames.size());
        Page<LocationShortDto> expectedOrgLocationsPage = orgLocationsPage.map(locationMapper::convertToShortDto);
        String locationName = "Парк";

        //when
        when(organizationLocationService.getAllByLocationName(organizationId.getId(), pageable, locationName))
            .thenReturn(orgLocationsPage);

        //then
        ResponseEntity<Page<LocationShortDto>> fetchedLocations = locationController.getOrganizationLocationByName(pageable, locationName, organizationId);
        assertEquals(ResponseEntity.ok(expectedOrgLocationsPage), fetchedLocations);
    }

    @Test
    void expectUpdateLocationWhenLocationAssociatesWithOrganization() {
        //given
        LocationFullDto expectedUpdatedLocation = LocationTestUtils.createDefaultLocation();
        expectedUpdatedLocation.setName("Крыжовка");
        OrganizationId organizationId = new OrganizationId(1L);
        Long locationId = 1L;

        //when
        when(organizationLocationService.update(locationId, organizationId.getId(), expectedUpdatedLocation))
            .thenReturn(expectedUpdatedLocation);

        //then
        ResponseEntity<LocationFullDto> updatedLocation = locationController.updateLocation(expectedUpdatedLocation, locationId, organizationId);
        assertEquals(ResponseEntity.ok(expectedUpdatedLocation), updatedLocation);
    }

    @Test
    void expectIllegalArgumentExceptionWhenUpdateLocationAndLocationAssociatesWithOrganization() {
        //given
        LocationFullDto locationToUpdate = LocationTestUtils.createDefaultLocation();
        OrganizationId organizationId = new OrganizationId(1L);
        Long nonExistingLocationId = 1000L;

        //when
        when(organizationLocationService.update(nonExistingLocationId, organizationId.getId(), locationToUpdate))
            .thenThrow(new IllegalArgumentException());

        //then
        assertThrows(IllegalArgumentException.class, () -> locationController.updateLocation(locationToUpdate, nonExistingLocationId, organizationId));
    }

    @Test
    void expectDeleteLocationWhenLocationAssociatesWithOrganization() {
        //given
        ResponseEntity<Object> expectedDeleteResponse = ResponseEntity.noContent().build();
        OrganizationId organizationId = new OrganizationId(1L);
        Long locationId = 1L;

        //when

        //then
        ResponseEntity<Long> deleteResponse = locationController.deleteLocation(locationId, organizationId);
        assertEquals(expectedDeleteResponse, deleteResponse);
    }

    @Test
    void expectIllegalArgumentExceptionWhenDeleteLocationAndLocationNotAssociatesWithOrganization() {
        //given
        OrganizationId organizationId = new OrganizationId(1L);
        Long nonExistingLocationId = 1000L;

        //when
        doThrow(new IllegalArgumentException()).when(organizationLocationService).delete(nonExistingLocationId, organizationId.getId());

        //then
        assertThrows(IllegalArgumentException.class, () -> locationController.deleteLocation(nonExistingLocationId, organizationId));
    }

    @Test
    void expectToggleFavoriteLocationWhenLocationAssociatesWithOrganization() {
        //given
        OrganizationId organizationId = new OrganizationId(1L);
        Long locationId = 1L;
        ResponseEntity<Long> expectedToggleFavoriteLocationResponse = ResponseEntity.ok(locationId);

        //when

        //then
        ResponseEntity<Long> toggleFavoriteLocationResponse = locationController.toggleFavoriteLocation(locationId, organizationId);
        assertEquals(expectedToggleFavoriteLocationResponse, toggleFavoriteLocationResponse);
    }

    @Test
    void expectIllegalArgumentExceptionWhenLocationNotAssociatesWithOrganization() {
        //given
        OrganizationId organizationId = new OrganizationId(1L);
        Long nonExistingLocationId = 1000L;

        //when
        doThrow(new IllegalArgumentException()).when(organizationLocationService).toggleFavorite(nonExistingLocationId, organizationId.getId());

        //then
        assertThrows(IllegalArgumentException.class, () -> locationController.toggleFavoriteLocation(nonExistingLocationId, organizationId));
    }

    private List<LocationFullDto> getLocationsWithCustomNames(List<String> locationsNames) {
        return locationsNames.stream()
            .map(name -> {
                LocationFullDto defaultLocation = LocationTestUtils.createDefaultLocation();
                defaultLocation.setName(name);
                return defaultLocation;
            })
            .collect(Collectors.toList());
    }
}
