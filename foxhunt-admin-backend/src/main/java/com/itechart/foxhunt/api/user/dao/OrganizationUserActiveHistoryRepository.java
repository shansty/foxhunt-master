package com.itechart.foxhunt.api.user.dao;

import com.itechart.foxhunt.domain.entity.OrganizationUserActiveHistoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrganizationUserActiveHistoryRepository extends JpaRepository<OrganizationUserActiveHistoryEntity, Long> {
}
