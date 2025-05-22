package com.itechart.foxhunt.api.competition.mapper;

import com.itechart.foxhunt.api.competition.config.CompetitionTemplateConfig;
import com.itechart.foxhunt.domain.entity.CompetitionEntity;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CompetitionTemplateMapper {

    CompetitionEntity domainToEntity(CompetitionTemplateConfig.CompetitionTemplate competition);

}
