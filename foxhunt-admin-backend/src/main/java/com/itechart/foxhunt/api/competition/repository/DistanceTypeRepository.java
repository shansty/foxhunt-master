package com.itechart.foxhunt.api.competition.repository;

import com.itechart.foxhunt.domain.entity.DistanceTypeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DistanceTypeRepository extends JpaRepository<DistanceTypeEntity, Long> {
    Optional<DistanceTypeEntity> findByName(String name);
}
