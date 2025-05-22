package com.itechart.foxhunt.api.help.repository;

import com.itechart.foxhunt.domain.entity.HelpContentArticleEntity;
import com.itechart.foxhunt.domain.entity.HelpContentTopicEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HelpContentArticleRepository extends JpaRepository<HelpContentArticleEntity, Long> {

    Long countAllByHelpContentTopic(HelpContentTopicEntity helpContentTopicEntity);

    List<HelpContentArticleEntity> getAllByHelpContentTopic(HelpContentTopicEntity helpContentTopicEntity);

}
