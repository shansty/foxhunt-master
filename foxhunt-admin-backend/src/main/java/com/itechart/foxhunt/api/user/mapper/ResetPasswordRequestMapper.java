package com.itechart.foxhunt.api.user.mapper;

import com.itechart.foxhunt.api.user.dto.ResetPasswordRequest;
import com.itechart.foxhunt.api.user.dto.User;
import com.itechart.foxhunt.api.user.entity.ResetPasswordRequestEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(
    unmappedSourcePolicy = org.mapstruct.ReportingPolicy.IGNORE,
    unmappedTargetPolicy = org.mapstruct.ReportingPolicy.IGNORE
)
public interface ResetPasswordRequestMapper {

    @Mapping(target = "user", source = "user")
    ResetPasswordRequest entityToDomain(ResetPasswordRequestEntity resetPasswordRequestEntity, User user);

}
