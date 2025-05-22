package com.itechart.foxhunt.api.user.dao;

import com.itechart.foxhunt.domain.entity.UserFeedbackEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserFeedbackRepository extends JpaRepository<UserFeedbackEntity, Long> {

    @Query(value = """ 
        SELECT * FROM fh_admin.user_feedback uf
        WHERE uf.organization_id = :organizationId AND uf.user_id = :userId""", nativeQuery = true)
    List<UserFeedbackEntity> findAllByOrganizationAndUser(@Param("organizationId") Long organizationId,
                                                          @Param("userId") Long userId);

    @Query(value = """
        SELECT EXISTS(SELECT 1 FROM fh_admin.user_feedback uf
        WHERE uf.organization_id = :organizationId AND uf.user_id = :userId)""", nativeQuery = true)
    boolean existsByOrganizationAndUser(@Param("organizationId") Long organizationId, @Param("userId") Long userId);

}
