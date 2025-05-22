package com.itechart.foxhunt.api.help.mapper;

import com.itechart.foxhunt.api.help.dto.HelpContentArticle;
import com.itechart.foxhunt.domain.entity.HelpContentArticleEntity;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface HelpContentArticleMapper {
    HelpContentArticleEntity domainToEntity(HelpContentArticle helpContentArticle);

    HelpContentArticle entityToDomain(HelpContentArticleEntity helpContentArticleEntity);
}
