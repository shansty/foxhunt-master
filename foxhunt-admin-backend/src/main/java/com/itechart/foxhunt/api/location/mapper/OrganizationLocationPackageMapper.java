package com.itechart.foxhunt.api.location.mapper;

import com.itechart.foxhunt.api.location.dto.OrganizationPackageAssignment;
import com.itechart.foxhunt.domain.entity.OrganizationLocationPackageEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface OrganizationLocationPackageMapper {

    @Mappings({
        @Mapping(target = "locationPackageId", source = "entity.locationPackageEntity.locationPackageId"),
        @Mapping(target = "organizationId", source = "entity.id.organizationId"),
        @Mapping(target = "accessType", source = "entity.locationPackageEntity.accessType")
    })
    OrganizationPackageAssignment entityToDomain(OrganizationLocationPackageEntity entity);
}
