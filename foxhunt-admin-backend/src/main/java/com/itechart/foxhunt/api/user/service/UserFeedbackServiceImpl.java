package com.itechart.foxhunt.api.user.service;

import com.itechart.foxhunt.api.user.dao.UserFeedbackRepository;
import com.itechart.foxhunt.api.user.dto.UserFeedback;
import com.itechart.foxhunt.api.user.mapper.UserFeedbackMapper;
import com.itechart.foxhunt.domain.entity.UserEntity;
import com.itechart.foxhunt.domain.entity.UserFeedbackEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserFeedbackServiceImpl implements UserFeedbackService {

    private final UserFeedbackRepository userFeedbackRepository;

    private final UserFeedbackMapper userFeedbackMapper;

    @Override
    public Optional<UserFeedback> create(UserFeedback userFeedback, UserEntity userEntity,
                                         Long organizationId) {
        if (!checkIfUserHaveFeedback(organizationId, userEntity.getId())) {
            UserFeedbackEntity feedbackToCreate = buildUserFeedbackEntity(organizationId, userFeedback, userEntity);
            UserFeedbackEntity createdFeedback = userFeedbackRepository.save(feedbackToCreate);
            return Optional.of(userFeedbackMapper.entityToDomain(createdFeedback));
        }
        return Optional.empty();
    }

    @Override
    public List<UserFeedback> getAll(UserEntity userEntity, Long organizationId) {
        return getAllFeedbacksByUserAndOrganization(organizationId, userEntity.getId())
            .stream()
            .map(userFeedbackMapper::entityToDomain).toList();
    }

    @Override
    public Optional<UserFeedback> updateOne(
        UserFeedback userFeedback, UserEntity userEntity, Long organizationId) {
        if (isUserFeedbackCreator(userFeedback, userEntity)) {
            UserFeedbackEntity feedbackToUpdate = buildUserFeedbackEntity(organizationId, userFeedback, userEntity);
            UserFeedbackEntity updatedFeedback = userFeedbackRepository.save(feedbackToUpdate);
            return Optional.of(userFeedbackMapper.entityToDomain(updatedFeedback));
        }
        return Optional.empty();
    }

    private UserFeedbackEntity buildUserFeedbackEntity(Long organizationId, UserFeedback userFeedback, UserEntity userEntity) {
        UserFeedbackEntity userFeedbackEntity = userFeedbackMapper.domainToEntity(userFeedback);
        userFeedbackEntity.setUser(userEntity);
        userFeedbackEntity.setOrganizationId(organizationId);
        userFeedbackEntity.setSendDate(LocalDateTime.now());
        userFeedbackEntity.setHasRead(false);
        return userFeedbackEntity;
    }

    private boolean checkIfUserHaveFeedback(Long organizationId, Long userId) {
        return userFeedbackRepository.existsByOrganizationAndUser(organizationId, userId);
    }

    private boolean isUserFeedbackCreator(UserFeedback userFeedback, UserEntity userEntity) {
        UserFeedbackEntity feedback = getById(userFeedback.getId());
        return feedback.getUser().getId().equals(userEntity.getId());
    }

    private List<UserFeedbackEntity> getAllFeedbacksByUserAndOrganization(Long organizationId, Long userId) {
        return userFeedbackRepository.findAllByOrganizationAndUser(organizationId, userId);
    }

    private UserFeedbackEntity getById(Long feedbackId) {
        return userFeedbackRepository.findById(feedbackId).orElseThrow(() -> {
            throw new EntityNotFoundException(
                "Feedback with id '" + feedbackId + "' does not exist");
        });
    }
}
