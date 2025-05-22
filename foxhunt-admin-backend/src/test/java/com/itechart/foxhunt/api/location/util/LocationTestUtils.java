package com.itechart.foxhunt.api.location.util;

import com.itechart.foxhunt.api.location.dto.LocationFullDto;
import com.itechart.foxhunt.api.location.dto.LocationPackageFullDto;
import com.itechart.foxhunt.api.organization.Organization;
import com.itechart.foxhunt.domain.entity.OrganizationLocationPackageCompositePK;
import com.itechart.foxhunt.domain.entity.location.LocationPackageEntity;
import com.itechart.foxhunt.domain.entity.location.function.OrganizationLocationPackageFunctionResult;
import com.itechart.foxhunt.domain.enums.LocationPackageAccessType;
import com.itechart.foxhunt.domain.enums.LocationPackageAssignmentType;
import com.itechart.foxhunt.domain.enums.OrganizationStatus;
import com.itechart.foxhunt.domain.enums.OrganizationType;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Polygon;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

public class LocationTestUtils {

    private static final GeometryFactory geometryFactory = new GeometryFactory();

    public static LocationFullDto createDefaultLocation() {
        Coordinate locationCenter = new Coordinate(53.907, 27.567);

        return LocationFullDto.builder()
            .name("Default Location Name")
            .description("Default Location Description")
            .center(geometryFactory.createPoint(locationCenter))
            .coordinates(getLocationCoordinates())
            .forbiddenAreas(new ArrayList<>())
            .zoom((byte) 1)
            .isGlobal(false)
            .isUpdatable(false)
            .build();
    }

    private static Polygon getLocationCoordinates() {
        Coordinate[] coordinates = {
            new Coordinate(53.967015598681506, 27.5038577414646678),
            new Coordinate(53.938260448978596, 27.606854240818564),
            new Coordinate(53.856341019487324, 27.573895256443567),
            new Coordinate(53.86242969215875, 27.450299065037314),
            new Coordinate(53.90786365101279, 27.433819572849817),
            new Coordinate(53.93704500397775, 27.432446281834192),
            new Coordinate(53.967015598681506, 27.503857414646678),
            new Coordinate(53.967015598681506, 27.5038577414646678)
        };
        return geometryFactory.createPolygon(coordinates);
    }

    public static List<LocationFullDto> createLocationsWithCustomNames(List<String> names) {
        return IntStream.range(0, names.size())
            .mapToObj(index -> {
                LocationFullDto defaultLocation = createDefaultLocation();
                defaultLocation.setName(names.get(index));
                defaultLocation.setId((long) index);
                return defaultLocation;
            }).collect(Collectors.toList());
    }

    public static LocationPackageFullDto createLocationPackageDto() {
        Coordinate locationPackageCenter = new Coordinate(53.907, 27.567);

        LocationPackageFullDto locationPackageDto = new LocationPackageFullDto();
        locationPackageDto.setLocationPackageId(1L);
        locationPackageDto.setName("Default Location Package Name");
        locationPackageDto.setDescription("Description");
        locationPackageDto.setZoom((byte) 10);
        locationPackageDto.setCenter(geometryFactory.createPoint(locationPackageCenter));
        locationPackageDto.setAccessType(LocationPackageAccessType.PRIVATE);
        locationPackageDto.setAssignmentType(LocationPackageAssignmentType.LIST_BASED);
        locationPackageDto.setExactAreaMatch(false);
        locationPackageDto.setLocations(new HashSet<>());

        return locationPackageDto;
    }

    public static OrganizationLocationPackageFunctionResult createLocationPackageFunctionResult(Organization organization,
                                                                                                LocationPackageEntity locationPackage) {
        OrganizationLocationPackageFunctionResult organizationLocationPackage = new OrganizationLocationPackageFunctionResult();
        OrganizationLocationPackageCompositePK id =
            new OrganizationLocationPackageCompositePK(organization.getId(), locationPackage.getLocationPackageId());
        organizationLocationPackage.setId(id);
        organizationLocationPackage.setLocationPackageEntity(locationPackage);
        organizationLocationPackage.setIsUpdatable(true);
        return organizationLocationPackage;
    }

    public static Organization createOrganization() {
        Organization organization = new Organization();

        organization.setId(1L);
        organization.setName("Radio School");
        organization.setLegalAddress("ul. Pravdy 5");
        organization.setActualAddress("ul. Pravdy 5");
        organization.setApproximateEmployeesNumber(11);
        organization.setStatus(OrganizationStatus.ACTIVE);
        organization.setType(OrganizationType.FREE);
        organization.setSystem(false);
        organization.setFavoriteLocations(Set.of());

        return organization;
    }

}
