package com.itechart.foxhunt.api.user.dao;

import com.itechart.foxhunt.api.user.entity.ResetPasswordRequestEntity;
import com.itechart.foxhunt.api.user.ResetPasswordRequestStatus;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResetPasswordRequestRepository extends
    JpaRepository<ResetPasswordRequestEntity, Long> {

    Optional<ResetPasswordRequestEntity> findByTokenAndStatus(String token,
        ResetPasswordRequestStatus status);

    Optional<ResetPasswordRequestEntity> findByToken(String token);
}
