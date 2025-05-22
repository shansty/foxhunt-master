package com.itechart.foxhunt.api.user.dao;

import com.itechart.foxhunt.api.user.entity.SystemAdminEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface SystemAdminRepository extends JpaRepository<SystemAdminEntity, Long> {

    Optional<SystemAdminEntity> findByEmail(String email);

    @Query(value = "SELECT admin.email FROM fh_admin.system_admin AS admin LIMIT 1", nativeQuery = true)
    String getSystemAdminEmail();

}
