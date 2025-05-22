package com.itechart.foxhunt.api.location.service;


import com.itechart.foxhunt.api.AbstractMigrationTest;
import com.itechart.foxhunt.api.auth.security.UserAuthentication;
import com.itechart.foxhunt.api.exception.BadRequestException;
import com.itechart.foxhunt.api.location.dao.LocationPackageRepository;
import com.itechart.foxhunt.api.location.dao.OrganizationLocationPackageFunctionRepository;
import com.itechart.foxhunt.api.location.dto.LocationPackageFullDto;
import com.itechart.foxhunt.api.location.dto.OrganizationPackageAssignment;
import com.itechart.foxhunt.api.location.mapper.LocationPackageMapper;
import com.itechart.foxhunt.domain.enums.LocationPackageAccessType;
import com.itechart.foxhunt.domain.enums.LocationPackageAssignmentType;
import com.itechart.foxhunt.domain.enums.Role;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.Polygon;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import static com.itechart.foxhunt.api.location.service.LocationConstantsStorage.SYSTEM_ORGANIZATION_ID;
import static org.junit.jupiter.api.Assertions.*;

@Transactional
public class OrganizationLocationPackageServiceIntegrationTest extends AbstractMigrationTest {

    private final GeometryFactory geometryFactory = new GeometryFactory();

    private final UserAuthentication systemAdminAuthentication =
        buildUserAuthentication(SYSTEM_ORGANIZATION_ID, "alexander.belyaev@itechart-group.com", Set.of(Role.ORGANIZATION_ADMIN));

    @Autowired
    private LocationPackageRepository locationPackageRepository;

    @Autowired
    private OrganizationLocationPackageFunctionRepository organizationLocationPackageFunctionRepository;

    @Autowired
    private OrganizationPackageAssignmentService organizationPackageAssignmentService;

    @Autowired
    private LocationPackageMapper locationPackageMapper;

    @Autowired
    private OrganizationLocationPackageService organizationLocationPackageService;

    @Test
    void expectReturnsAllLocationPackagesAvailableForNonSystemOrganization() {
        //given
        Long organizationId = 1L;
        Pageable pageable = PageRequest.of(0, 10);
        List<LocationPackageAccessType> notUpdatableAccessTypes =
            List.of(LocationPackageAccessType.SHARED, LocationPackageAccessType.SYSTEM);

        LocationPackageFullDto sharedPackageToCreate = getAreaBasedPackage();
        sharedPackageToCreate.setAccessType(LocationPackageAccessType.SHARED);
        LocationPackageFullDto createdPackage =
            createLocationPackage(SYSTEM_ORGANIZATION_ID, systemAdminAuthentication, sharedPackageToCreate);

        OrganizationPackageAssignment sharedLocationPackageAssignment =
            new OrganizationPackageAssignment(createdPackage.getLocationPackageId(), organizationId, LocationPackageAccessType.SHARED);
        organizationPackageAssignmentService.assignAll(List.of(sharedLocationPackageAssignment));

        Page<LocationPackageFullDto> expectedReturnedPage = organizationLocationPackageFunctionRepository
            .findAllByOrganizationId(pageable, organizationId, SYSTEM_ORGANIZATION_ID)
            .map(functionResult -> {
                LocationPackageFullDto locationPackage =
                    locationPackageMapper.entityToDomain(functionResult.getLocationPackageEntity());
                locationPackage.setIsUpdatable(functionResult.getIsUpdatable());
                return locationPackage;
            });

        //when
        UserAuthentication orgAdminAuthentication =
            buildUserAuthentication(organizationId, "1123@gmail.com", Set.of(Role.ORGANIZATION_ADMIN));
        SecurityContextHolder.getContext().setAuthentication(orgAdminAuthentication);

        //then
        Page<LocationPackageFullDto> returnedPage =
            organizationLocationPackageService.getAllOrganizationPackages(pageable, organizationId);
        returnedPage.getContent().stream()
            .filter(locationPackage -> notUpdatableAccessTypes.contains(locationPackage.getAccessType()))
            .forEach(locationPackage -> assertFalse(locationPackage.getIsUpdatable()));
        assertEquals(expectedReturnedPage, returnedPage);
    }

    @Test
    void expectCreatesSharedLocationPackageFromSystemOrganization() {
        //given
        LocationPackageFullDto sharedPackageToCreate = getAreaBasedPackage();
        sharedPackageToCreate.setAccessType(LocationPackageAccessType.SHARED);

        //when
        LocationPackageFullDto createdPackage =
            createLocationPackage(SYSTEM_ORGANIZATION_ID, systemAdminAuthentication, sharedPackageToCreate);

        //then
        LocationPackageFullDto expectedCreatedPackage =
            organizationLocationPackageService.findById(createdPackage.getLocationPackageId(), SYSTEM_ORGANIZATION_ID);
        assertEquals(expectedCreatedPackage, createdPackage);
    }

    @Test
    void expectBadRequestExceptionWhenAreaBasedPackageAndPackageAreaNotWithinEarthCoordinates() {
        //given
        LocationPackageFullDto areaBasedPackage = getAreaBasedPackage();
        Polygon packageCoordinates = geometryFactory.createPolygon(new Coordinate[]{
            new Coordinate(1000, 1000),
            new Coordinate(1000, 1000),
            new Coordinate(1000, 1000),
            new Coordinate(1000, 1000),
            new Coordinate(1000, 1000)
        });
        packageCoordinates.setSRID(4326);
        areaBasedPackage.setCoordinates(packageCoordinates);

        //when
        assertThrows(BadRequestException.class,
            () -> createLocationPackage(SYSTEM_ORGANIZATION_ID, systemAdminAuthentication, areaBasedPackage));
    }

    @Test
    void expectIllegalArgumentExceptionWhenCreatingSharedLocationPackageFromNonSystemOrganization() {
        //given
        Long organizationId = 1L;
        LocationPackageFullDto sharedPackageToCreate = getAreaBasedPackage();
        sharedPackageToCreate.setAccessType(LocationPackageAccessType.SHARED);

        LocationPackageFullDto createdPackage =
            createLocationPackage(SYSTEM_ORGANIZATION_ID, systemAdminAuthentication, sharedPackageToCreate);
        createdPackage.setName("Updated Location Package Name");
        OrganizationPackageAssignment sharedLocationPackageAssignment =
            new OrganizationPackageAssignment(createdPackage.getLocationPackageId(), organizationId, LocationPackageAccessType.SHARED);
        organizationPackageAssignmentService.assignAll(List.of(sharedLocationPackageAssignment));

        //when
        UserAuthentication orgAdminAuthentication =
            buildUserAuthentication(organizationId, "1123@gmail.com", Set.of(Role.ORGANIZATION_ADMIN));
        SecurityContextHolder.getContext().setAuthentication(orgAdminAuthentication);

        //then
        assertThrows(IllegalArgumentException.class, () -> organizationLocationPackageService
            .create(organizationId, createdPackage));
    }

    @Test
    void expectUpdatesSharedLocationPackageFromSystemOrganization() {
        //given
        LocationPackageFullDto sharedPackageToCreate = getAreaBasedPackage();
        sharedPackageToCreate.setAccessType(LocationPackageAccessType.SHARED);
        LocationPackageFullDto createdPackage =
            createLocationPackage(SYSTEM_ORGANIZATION_ID, systemAdminAuthentication, sharedPackageToCreate);
        Long sharedPackageId = createdPackage.getLocationPackageId();

        //when
        LocationPackageFullDto locationPackageToUpdate =
            organizationLocationPackageService.findById(sharedPackageId, SYSTEM_ORGANIZATION_ID);
        locationPackageToUpdate.setName("Updated Location Package Name");

        //then
        LocationPackageFullDto updatedPackage =
            organizationLocationPackageService.update(sharedPackageId, SYSTEM_ORGANIZATION_ID, locationPackageToUpdate);
        assertEquals(locationPackageToUpdate.getName(), updatedPackage.getName());
    }

    @Test
    void expectSharedLocationPackageNotUpdatableFromNonSystemOrganization() {
        //given
        Long organizationId = 1L;
        LocationPackageFullDto sharedPackageToCreate = getAreaBasedPackage();
        sharedPackageToCreate.setAccessType(LocationPackageAccessType.SHARED);

        LocationPackageFullDto createdPackage =
            createLocationPackage(SYSTEM_ORGANIZATION_ID, systemAdminAuthentication, sharedPackageToCreate);
        OrganizationPackageAssignment sharedLocationPackageAssignment =
            new OrganizationPackageAssignment(createdPackage.getLocationPackageId(), organizationId, LocationPackageAccessType.SHARED);
        organizationPackageAssignmentService.assignAll(List.of(sharedLocationPackageAssignment));

        //when
        UserAuthentication orgAdminAuthentication =
            buildUserAuthentication(organizationId, "1123@gmail.com", Set.of(Role.ORGANIZATION_ADMIN));
        SecurityContextHolder.getContext().setAuthentication(orgAdminAuthentication);

        //then
        LocationPackageFullDto sharedPackageInNonSystemOrg =
            organizationLocationPackageService.findById(createdPackage.getLocationPackageId(), organizationId);
        assertFalse(sharedPackageInNonSystemOrg.getIsUpdatable());
    }

    @Test
    void expectIllegalArgumentExceptionWhenUpdatingSharedLocationPackageFromNonSystemOrganization() {
        //given
        Long organizationId = 1L;
        LocationPackageFullDto sharedPackageToCreate = getAreaBasedPackage();
        sharedPackageToCreate.setAccessType(LocationPackageAccessType.SHARED);

        LocationPackageFullDto createdPackage =
            createLocationPackage(SYSTEM_ORGANIZATION_ID, systemAdminAuthentication, sharedPackageToCreate);
        OrganizationPackageAssignment sharedLocationPackageAssignment =
            new OrganizationPackageAssignment(createdPackage.getLocationPackageId(), organizationId, LocationPackageAccessType.SHARED);
        organizationPackageAssignmentService.assignAll(List.of(sharedLocationPackageAssignment));

        //when
        UserAuthentication orgAdminAuthentication =
            buildUserAuthentication(organizationId, "1123@gmail.com", Set.of(Role.ORGANIZATION_ADMIN));
        SecurityContextHolder.getContext().setAuthentication(orgAdminAuthentication);

        //then
        createdPackage.setName("Updated Location Package Name");
        assertThrows(IllegalArgumentException.class, () -> organizationLocationPackageService
            .update(createdPackage.getLocationPackageId(), organizationId, createdPackage));
    }

    @Test
    void expectIllegalArgumentExceptionWhenDeletingSharedLocationPackageFromNonSystemOrganization() {
        //given
        Long organizationId = 1L;
        LocationPackageFullDto sharedPackageToCreate = getAreaBasedPackage();
        sharedPackageToCreate.setAccessType(LocationPackageAccessType.SHARED);

        LocationPackageFullDto createdPackage =
            createLocationPackage(SYSTEM_ORGANIZATION_ID, systemAdminAuthentication, sharedPackageToCreate);

        OrganizationPackageAssignment sharedLocationPackageAssignment =
            new OrganizationPackageAssignment(createdPackage.getLocationPackageId(), organizationId, LocationPackageAccessType.SHARED);
        organizationPackageAssignmentService.assignAll(List.of(sharedLocationPackageAssignment));

        //when
        UserAuthentication orgAdminAuthentication =
            buildUserAuthentication(organizationId, "1123@gmail.com", Set.of(Role.ORGANIZATION_ADMIN));
        SecurityContextHolder.getContext().setAuthentication(orgAdminAuthentication);

        //then
        assertThrows(IllegalArgumentException.class, () -> organizationLocationPackageService
            .delete(createdPackage.getLocationPackageId(), organizationId));
    }

    @Test
    void expectDeletesSharedLocationPackageFromSystemOrganization() {
        //given
        LocationPackageFullDto sharedPackageToCreate = getAreaBasedPackage();
        sharedPackageToCreate.setAccessType(LocationPackageAccessType.SHARED);
        LocationPackageFullDto createdPackage =
            createLocationPackage(SYSTEM_ORGANIZATION_ID, systemAdminAuthentication, sharedPackageToCreate);

        //when
        organizationLocationPackageService.delete(createdPackage.getLocationPackageId(), SYSTEM_ORGANIZATION_ID);

        //then
        assertEquals(Optional.empty(), locationPackageRepository.findById(createdPackage.getLocationPackageId()));
    }

    private LocationPackageFullDto createLocationPackage(Long organizationId,
                                                         UserAuthentication createdBy,
                                                         LocationPackageFullDto packageToCreate) {
        SecurityContextHolder.getContext().setAuthentication(createdBy);
        return organizationLocationPackageService.create(organizationId, packageToCreate);
    }

    private UserAuthentication buildUserAuthentication(Long organizationId, String userEmail, Set<Role> roles) {
        Set<GrantedAuthority> authorities = roles.stream()
            .map(role -> new SimpleGrantedAuthority(role.getRoleString()))
            .collect(Collectors.toSet());
        return new UserAuthentication(userEmail, organizationId, authorities);
    }

    private LocationPackageFullDto getAreaBasedPackage() {
        LocationPackageFullDto locationBasedPackage = new LocationPackageFullDto();
        Point packageAreaCenter = geometryFactory.createPoint(new Coordinate(53.907, 27.557));
        packageAreaCenter.setSRID(4326);
        Polygon packageAreaCoordinates = geometryFactory.createPolygon(new Coordinate[]{
            new Coordinate(53.97328840127652, 27.590345947265597),
            new Coordinate(53.96681108582918, 27.46537646484372),
            new Coordinate(53.913334631636694, 27.40083178710935),
            new Coordinate(53.84111335551218, 27.443403808593732),
            new Coordinate(53.83217842726461, 27.64115771484374),
            new Coordinate(53.87439939914014, 27.69608935546873),
            new Coordinate(53.94413251577516, 27.672743408203115),
            new Coordinate(53.97328840127652, 27.590345947265597)
        });
        packageAreaCoordinates.setSRID(4326);

        locationBasedPackage.setName("Location based package");
        locationBasedPackage.setDescription("Location based package description");
        locationBasedPackage.setAccessType(LocationPackageAccessType.PRIVATE);
        locationBasedPackage.setAssignmentType(LocationPackageAssignmentType.AREA_BASED);
        locationBasedPackage.setCenter(packageAreaCenter);
        locationBasedPackage.setCoordinates(packageAreaCoordinates);
        locationBasedPackage.setExactAreaMatch(true);
        locationBasedPackage.setZoom((byte) 10);
        return locationBasedPackage;
    }

}
