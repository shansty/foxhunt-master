package com.itechart.foxhunt.api.help.mapper;

import com.itechart.foxhunt.api.help.dto.HelpContentTopic;
import com.itechart.foxhunt.domain.entity.HelpContentTopicEntity;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface HelpContentTopicMapper {

    HelpContentTopicEntity domainToEntity(HelpContentTopic helpContentTopic);

    HelpContentTopic entityToDomain(HelpContentTopicEntity helpContentTopicEntity);
}
