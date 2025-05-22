package com.itechart.foxhunt.api.competition.mapper;

import com.itechart.foxhunt.domain.entity.FoxPointEntity;
import com.itechart.foxhunt.api.competition.dto.FoxPoint;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface FoxPointMapper {

    FoxPointEntity domainToEntity(FoxPoint foxPoint);

    FoxPoint entityToDomain(FoxPointEntity foxPointEntity);

    List<FoxPointEntity> domainListToEntityList(List<FoxPoint> foxPoints);
}
