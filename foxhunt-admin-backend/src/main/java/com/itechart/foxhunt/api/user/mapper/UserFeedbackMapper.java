package com.itechart.foxhunt.api.user.mapper;

import com.itechart.foxhunt.api.user.dto.UserFeedback;
import com.itechart.foxhunt.domain.entity.UserFeedbackEntity;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserFeedbackMapper {

    UserFeedbackEntity domainToEntity(UserFeedback user);

    UserFeedback entityToDomain(UserFeedbackEntity userEntity);
}
