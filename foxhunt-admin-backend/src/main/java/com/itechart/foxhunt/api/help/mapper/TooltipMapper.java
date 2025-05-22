package com.itechart.foxhunt.api.help.mapper;

import com.itechart.foxhunt.api.help.dto.Tooltip;
import com.itechart.foxhunt.domain.entity.TooltipEntity;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface TooltipMapper {

    TooltipEntity domainToEntity(Tooltip tooltip);

    Tooltip entityToDomain(TooltipEntity tooltipEntity);
}
