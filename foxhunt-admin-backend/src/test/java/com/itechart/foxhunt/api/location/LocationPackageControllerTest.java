package com.itechart.foxhunt.api.location;

import com.itechart.foxhunt.api.core.OrganizationId;
import com.itechart.foxhunt.api.exception.BadRequestException;
import com.itechart.foxhunt.api.location.dto.LocationFullDto;
import com.itechart.foxhunt.api.location.dto.LocationPackageFullDto;
import com.itechart.foxhunt.api.location.dto.LocationPackageShortDto;
import com.itechart.foxhunt.api.location.dto.LocationShortDto;
import com.itechart.foxhunt.api.location.mapper.*;
import com.itechart.foxhunt.api.location.service.OrganizationLocationPackageService;
import com.itechart.foxhunt.api.user.mapper.UserMapperImpl;
import com.itechart.foxhunt.domain.entity.location.LocationPackageEntity;
import com.itechart.foxhunt.domain.enums.LocationPackageAccessType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import javax.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static com.itechart.foxhunt.api.location.util.LocationTestUtils.createDefaultLocation;
import static com.itechart.foxhunt.api.location.util.LocationTestUtils.createLocationPackageDto;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith({MockitoExtension.class, SpringExtension.class})
@MockitoSettings(strictness = Strictness.LENIENT)
@ContextConfiguration(classes = {
    LocationPackageMapperImpl.class, LocationMapperImpl.class,
    ForbiddenAreaMapperImpl.class, UserMapperImpl.class
})
public class LocationPackageControllerTest {

    @Mock
    OrganizationLocationPackageService locationPackageService;

    @Autowired
    LocationPackageMapper locationPackageMapper;

    @Autowired
    LocationMapper locationMapper;

    LocationPackageControllerImpl locationPackageController;

    @BeforeEach
    void setup() {
        locationPackageController = new LocationPackageControllerImpl(locationPackageService, locationPackageMapper);
    }

    @Test
    void expectReturnsAllOrganizationPackages() {
        //given
        OrganizationId organizationId = new OrganizationId(1L);
        Set<LocationShortDto> packageLocations = convertToShortDto(Set.of(createDefaultLocation()));

        LocationPackageFullDto privateLocationPackage = createLocationPackageDto();
        privateLocationPackage.setLocations(packageLocations);
        privateLocationPackage.setAccessType(LocationPackageAccessType.PRIVATE);
        LocationPackageFullDto sharedLocationPackage = createLocationPackageDto();
        sharedLocationPackage.setLocations(packageLocations);
        sharedLocationPackage.setAccessType(LocationPackageAccessType.SHARED);
        List<LocationPackageFullDto> packagesReturnedFromService = List.of(privateLocationPackage, sharedLocationPackage);

        Pageable pageable = PageRequest.of(0, 10);
        Page<LocationPackageFullDto> fetchedPackagesPage = new PageImpl<>(packagesReturnedFromService, pageable, 10);

        //when
        when(locationPackageService.getAllOrganizationPackages(pageable, organizationId.getId()))
            .thenReturn(fetchedPackagesPage);

        //then
        Page<LocationPackageShortDto> expectedFetchedPage = fetchedPackagesPage.map(locationPackageMapper::convertToShortDto);
        ResponseEntity<Page<LocationPackageShortDto>> fetchedPackagesResponse = locationPackageController.getAllOrganizationPackages(pageable, organizationId);
        assertEquals(ResponseEntity.ok(expectedFetchedPage), fetchedPackagesResponse);
    }

    @Test
    void expectReturnsAllSharedLocationPackages() {
        //given
        LocationPackageAccessType accessType = LocationPackageAccessType.SHARED;
        LocationPackageEntity fetchedPackage = locationPackageMapper.domainToEntity(createLocationPackageDto());
        LocationPackageShortDto expectedFetchedPackage = locationPackageMapper.convertToShortDtoWithoutLocations(fetchedPackage);

        //when
        when(locationPackageService.getAllSystemPackages(any()))
            .thenReturn(List.of(fetchedPackage));

        //then
        ResponseEntity<List<LocationPackageShortDto>> expectedFetchedPackagesResponse = ResponseEntity.ok(List.of(expectedFetchedPackage));
        ResponseEntity<List<LocationPackageShortDto>> fetchedPackagesResponse = locationPackageController.getAllPackages(accessType);
        assertEquals(expectedFetchedPackagesResponse, fetchedPackagesResponse);
    }

    @Test
    void expectBadRequestExceptionWhenSystemAdminAttemptsToGetNotSharedLocationPackages() {
        //given
        LocationPackageAccessType accessType = LocationPackageAccessType.PRIVATE;

        //then
        assertThrows(BadRequestException.class, () -> locationPackageController.getAllPackages(accessType));
    }

    @Test
    void expectReturnsLocationPackageByProvidedId() {
        //given
        OrganizationId organizationId = new OrganizationId(1L);
        Long locationPackageId = 1L;
        LocationPackageFullDto locationPackage = createLocationPackageDto();
        LocationPackageFullDto expectedFetchedPackage = createLocationPackageDto();
        expectedFetchedPackage.setIsUpdatable(true);

        //when
        when(locationPackageService.findById(locationPackageId, organizationId.getId()))
            .thenReturn(locationPackage);
        locationPackage.setIsUpdatable(true);

        //then
        LocationPackageFullDto fetchedPackage = locationPackageController.getOne(locationPackageId, organizationId);
        assertEquals(expectedFetchedPackage, fetchedPackage);
    }

    @Test
    void expectEntityNotFoundExceptionWhenGetLocationPackageByIdAndPackageNotAssociatesWithOrganization() {
        //given
        OrganizationId organizationId = new OrganizationId(1L);
        Long locationPackageId = 1L;

        //when
        when(locationPackageService.findById(locationPackageId, organizationId.getId())).thenThrow(new EntityNotFoundException());

        //then
        assertThrows(EntityNotFoundException.class, () -> locationPackageController.getOne(locationPackageId, organizationId));
    }

    @Test
    void expectCreatesPrivateLocationPackageFromNonSystemOrganization() {
        //given
        OrganizationId organizationId = new OrganizationId(1L);
        LocationPackageFullDto locationPackageToCreate = createLocationPackageDto();
        LocationPackageFullDto expectedCreatedPackage = createLocationPackageDto();
        expectedCreatedPackage.setIsUpdatable(true);

        //when
        when(locationPackageService.create(organizationId.getId(), locationPackageToCreate))
            .thenReturn(expectedCreatedPackage);

        //then
        ResponseEntity<LocationPackageFullDto> createdLocationPackage = locationPackageController.createOne(locationPackageToCreate, organizationId);
        ResponseEntity<LocationPackageFullDto> expectedCreatedPackageResponse = ResponseEntity.status(HttpStatus.CREATED).body(expectedCreatedPackage);
        assertEquals(expectedCreatedPackageResponse, createdLocationPackage);
    }

    @Test
    void expectIllegalArgumentExceptionWhenCreatePrivateLocationFromSystemOrganization() {
        //given
        OrganizationId organizationId = new OrganizationId(1L);
        LocationPackageFullDto locationPackageToCreate = createLocationPackageDto();

        //when
        when(locationPackageService.create(organizationId.getId(), locationPackageToCreate))
            .thenThrow(new IllegalArgumentException());

        //then
        assertThrows(IllegalArgumentException.class, () -> locationPackageController.createOne(locationPackageToCreate, organizationId));
    }

    @Test
    void expectCreateSystemLocationPackageFromSystemOrganization() {
        //given
        OrganizationId organizationId = new OrganizationId(1L);

        LocationPackageFullDto locationPackageToCreate = createLocationPackageDto();
        locationPackageToCreate.setAccessType(LocationPackageAccessType.SYSTEM);
        LocationPackageFullDto expectedCreatedPackage = createLocationPackageDto();
        locationPackageToCreate.setAccessType(LocationPackageAccessType.SYSTEM);
        expectedCreatedPackage.setIsUpdatable(true);

        //when
        when(locationPackageService.create(organizationId.getId(), locationPackageToCreate))
            .thenReturn(expectedCreatedPackage);

        //then
        ResponseEntity<LocationPackageFullDto> createdLocationPackage = locationPackageController.createOne(locationPackageToCreate, organizationId);
        ResponseEntity<LocationPackageFullDto> expectedCreatedPackageResponse = ResponseEntity.status(HttpStatus.CREATED).body(expectedCreatedPackage);
        assertEquals(expectedCreatedPackageResponse, createdLocationPackage);
    }

    @Test
    void expectIllegalArgumentExceptionWhenCreateSystemLocationPackageFromNonSystemOrganization() {
        //given
        OrganizationId organizationId = new OrganizationId(1L);
        LocationPackageFullDto locationPackageToCreate = createLocationPackageDto();
        locationPackageToCreate.setAccessType(LocationPackageAccessType.SYSTEM);

        //when
        when(locationPackageService.create(organizationId.getId(), locationPackageToCreate))
            .thenThrow(new IllegalArgumentException());

        //then
        assertThrows(IllegalArgumentException.class, () -> locationPackageController.createOne(locationPackageToCreate, organizationId));
    }

    @Test
    void expectUpdatesPrivateLocationPackageFromNonSystemOrganization() {
        //given
        OrganizationId organizationId = new OrganizationId(1L);
        Long locationPackageId = 1L;

        LocationPackageFullDto locationPackageToUpdate = createLocationPackageDto();
        locationPackageToUpdate.setName("New Location Package Name");
        LocationPackageFullDto expectedCreatedPackage = createLocationPackageDto();
        expectedCreatedPackage.setName("New Location Package Name");
        expectedCreatedPackage.setIsUpdatable(true);

        //when
        when(locationPackageService.update(locationPackageId, organizationId.getId(), locationPackageToUpdate))
            .thenReturn(expectedCreatedPackage);

        //then
        ResponseEntity<LocationPackageFullDto> updatedLocationPackageResponse = locationPackageController.updateOne(locationPackageToUpdate, locationPackageId, organizationId);
        assertEquals(ResponseEntity.ok(expectedCreatedPackage), updatedLocationPackageResponse);
    }

    @Test
    void expectUpdatesSystemLocationPackageFromSystemOrganization() {
        //given
        OrganizationId organizationId = new OrganizationId(1L);
        Long locationPackageId = 1L;

        LocationPackageFullDto locationPackageToUpdate = createLocationPackageDto();
        locationPackageToUpdate.setName("New Location Package Name");
        locationPackageToUpdate.setAccessType(LocationPackageAccessType.SYSTEM);
        LocationPackageFullDto expectedCreatedPackage = createLocationPackageDto();
        expectedCreatedPackage.setName("New Location Package Name");
        expectedCreatedPackage.setAccessType(LocationPackageAccessType.SYSTEM);
        expectedCreatedPackage.setIsUpdatable(true);

        //when
        when(locationPackageService.update(locationPackageId, organizationId.getId(), locationPackageToUpdate))
            .thenReturn(expectedCreatedPackage);

        //then
        ResponseEntity<LocationPackageFullDto> updatedLocationPackageResponse = locationPackageController.updateOne(locationPackageToUpdate, locationPackageId, organizationId);
        assertEquals(ResponseEntity.ok(expectedCreatedPackage), updatedLocationPackageResponse);
    }

    @Test
    void expectIllegalArgumentExceptionWhenUpdatePrivateLocationPackageFromSystemOrganization() {
        //given
        OrganizationId organizationId = new OrganizationId(1L);
        Long locationPackageId = 1L;

        LocationPackageFullDto locationPackageToUpdate = createLocationPackageDto();
        locationPackageToUpdate.setName("New Location Package Name");
        locationPackageToUpdate.setAccessType(LocationPackageAccessType.SYSTEM);


        //when
        when(locationPackageService.update(locationPackageId, organizationId.getId(), locationPackageToUpdate))
            .thenThrow(new IllegalArgumentException());

        //then
        assertThrows(IllegalArgumentException.class, () -> locationPackageController.updateOne(locationPackageToUpdate, locationPackageId, organizationId));
    }

    @Test
    void expectIllegalArgumentExceptionWhenUpdateSharedLocationPackageFromNonSystemOrganization() {
        //given
        OrganizationId organizationId = new OrganizationId(1L);
        Long locationPackageId = 1L;

        LocationPackageFullDto locationPackageToUpdate = createLocationPackageDto();
        locationPackageToUpdate.setName("New Location Package Name");

        //when
        when(locationPackageService.update(locationPackageId, organizationId.getId(), locationPackageToUpdate))
            .thenThrow(new IllegalArgumentException());

        //then
        assertThrows(IllegalArgumentException.class,
            () -> locationPackageController.updateOne(locationPackageToUpdate, locationPackageId, organizationId));
    }

    @Test
    void expectDeletesLocationPackage() {
        //given
        OrganizationId organizationId = new OrganizationId(1L);
        Long locationPackageId = 1L;

        //when
        locationPackageController.deleteOne(locationPackageId, organizationId);

        //then
        verify(locationPackageService).delete(locationPackageId, organizationId.getId());
    }

    private Set<LocationShortDto> convertToShortDto(Set<LocationFullDto> locations) {
        return locations.stream().map(locationMapper::convertToShortDto).collect(Collectors.toSet());
    }

}
