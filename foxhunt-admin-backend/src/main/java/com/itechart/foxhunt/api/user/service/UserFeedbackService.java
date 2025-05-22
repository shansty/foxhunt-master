package com.itechart.foxhunt.api.user.service;

import com.itechart.foxhunt.api.user.dto.UserFeedback;
import com.itechart.foxhunt.domain.entity.UserEntity;
import java.util.List;
import java.util.Optional;

public interface UserFeedbackService {

    Optional<UserFeedback> create(UserFeedback userFeedback, UserEntity userEntity,
        Long organizationId);

    List<UserFeedback> getAll(UserEntity userEntity, Long organizationId);

    Optional<UserFeedback> updateOne(UserFeedback userFeedback, UserEntity userEntity,
        Long organizationId);
}
