package com.itechart.foxhunt.api.help.repository;

import com.itechart.foxhunt.domain.entity.HelpContentTopicEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface HelpContentTopicRepository extends JpaRepository<HelpContentTopicEntity, Long> {

    @Query(value = "SELECT hca FROM HelpContentTopicEntity hca WHERE hca.isSystem = true ")
    List<HelpContentTopicEntity> getAllSystemHelpContent();
}
