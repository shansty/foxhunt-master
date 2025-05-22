package com.itechart.foxhunt.api.help.service;

import com.itechart.foxhunt.api.help.dto.HelpContentTopic;
import com.itechart.foxhunt.api.help.dto.HelpContentArticle;

import java.util.List;

public interface HelpContentService {

    List<HelpContentTopic> getAll();

    void updateAll(List<HelpContentTopic> helpContentTopics);

    HelpContentTopic createTopic(HelpContentTopic helpContentTopic);

    HelpContentArticle createArticle(HelpContentArticle helpContentArticle, Long topicId);

    HelpContentArticle updateArticle(HelpContentArticle helpContentArticle);

    HelpContentTopic updateTopic(HelpContentTopic helpContentTopic);

    void removeTopic(Long topicId);

    void removeArticle(Long articleId);
}
