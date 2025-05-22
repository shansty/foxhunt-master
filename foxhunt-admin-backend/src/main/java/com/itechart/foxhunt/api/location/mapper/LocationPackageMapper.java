package com.itechart.foxhunt.api.location.mapper;

import com.itechart.foxhunt.api.location.dto.LocationPackageFullDto;
import com.itechart.foxhunt.api.location.dto.LocationPackageShortDto;
import com.itechart.foxhunt.api.user.mapper.UserMapper;
import com.itechart.foxhunt.domain.entity.location.LocationPackageEntity;
import com.itechart.foxhunt.domain.enums.LocationPackageAssignmentType;
import org.locationtech.jts.geom.Polygon;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.ReportingPolicy;

@Mapper(
    componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE,
    uses = {LocationMapper.class, UserMapper.class}
)
public interface LocationPackageMapper {

    @Mapping(target = "coordinates", source = "locationPackage", qualifiedByName = "getCoordinates")
    @Mapping(target = "exactAreaMatch", source = "locationPackage", qualifiedByName = "getExactAreaMatch")
    LocationPackageEntity domainToEntity(LocationPackageFullDto locationPackage);

    LocationPackageShortDto convertToShortDto(LocationPackageFullDto locationPackage);

    default LocationPackageShortDto convertToShortDtoWithoutLocations(LocationPackageEntity locationPackage) {
        LocationPackageShortDto locationPackageShortDto = new LocationPackageShortDto();

        locationPackageShortDto.setLocationPackageId(locationPackage.getLocationPackageId());
        locationPackageShortDto.setName(locationPackage.getName());

        return locationPackageShortDto;
    }

    @Named("getCoordinates")
    default Polygon getCoordinates(LocationPackageFullDto locationPackage) {
        return LocationPackageAssignmentType.AREA_BASED.equals(locationPackage.getAssignmentType()) ?
            locationPackage.getCoordinates() : null;
    }

    @Named("getExactAreaMatch")
    default Boolean getExactAreaMatch(LocationPackageFullDto locationPackage) {
        return locationPackage.getExactAreaMatch() != null ? locationPackage.getExactAreaMatch() : false;
    }

    LocationPackageFullDto entityToDomain(LocationPackageEntity locationPackageEntity);
}
