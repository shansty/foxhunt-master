package com.itechart.foxhunt.api.location.mapper;

import com.itechart.foxhunt.api.location.dto.ForbiddenArea;
import com.itechart.foxhunt.domain.entity.ForbiddenAreaEntity;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ForbiddenAreaMapper {

    ForbiddenAreaEntity domainToEntity(ForbiddenArea forbiddenArea);

    ForbiddenArea entityToDomain(ForbiddenAreaEntity forbiddenAreaEntity);

}
