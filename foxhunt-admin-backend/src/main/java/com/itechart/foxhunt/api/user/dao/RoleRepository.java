package com.itechart.foxhunt.api.user.dao;

import com.itechart.foxhunt.domain.entity.RoleEntity;
import com.itechart.foxhunt.domain.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<RoleEntity, Long> {

    Optional<RoleEntity> findByRole(Role role);

}
