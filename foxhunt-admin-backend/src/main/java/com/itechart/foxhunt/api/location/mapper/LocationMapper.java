package com.itechart.foxhunt.api.location.mapper;

import com.itechart.foxhunt.api.location.dto.CloneLocationRequest;
import com.itechart.foxhunt.api.location.dto.LocationFullDto;
import com.itechart.foxhunt.api.location.dto.LocationShortDto;
import com.itechart.foxhunt.api.user.mapper.UserMapper;
import com.itechart.foxhunt.domain.entity.location.LocationEntity;
import com.itechart.foxhunt.domain.entity.location.function.OrganizationLocationFunctionResult;
import org.mapstruct.*;

@Mapper(
    componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE,
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
    uses = {UserMapper.class, ForbiddenAreaMapper.class}
)
public interface LocationMapper {

    @Mapping(target = "isCloned", source = "isCloned", nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS)
    LocationEntity domainToEntity(LocationFullDto location);

    LocationFullDto entityToDomain(LocationEntity locationEntity);

    @Mapping(target = "id", source = "location.id")
    @Mapping(target = "name", source = "location.name")
    @Mapping(target = "isGlobal", source = "locationView.isGlobal")
    @Mapping(target = "isFavorite", source = "locationView.isFavorite")
    @Mapping(target = "isUpdatable", source = "locationView.isUpdatable")
    LocationFullDto entityToDomain(LocationEntity location, OrganizationLocationFunctionResult locationView);

    LocationFullDto mergeToDomain(@MappingTarget LocationFullDto target, CloneLocationRequest source);

    LocationShortDto convertToShortDto(LocationFullDto location);

}
