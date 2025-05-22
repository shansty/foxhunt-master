package com.itechart.foxhunt.api.help.service;

import com.itechart.foxhunt.api.help.mapper.HelpContentTopicMapper;
import com.itechart.foxhunt.api.help.repository.HelpContentArticleRepository;
import com.itechart.foxhunt.api.help.repository.HelpContentTopicRepository;
import com.itechart.foxhunt.api.help.mapper.HelpContentArticleMapper;
import com.itechart.foxhunt.api.help.dto.HelpContentArticle;
import com.itechart.foxhunt.api.help.dto.HelpContentTopic;
import com.itechart.foxhunt.domain.entity.HelpContentArticleEntity;
import com.itechart.foxhunt.domain.entity.HelpContentTopicEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HelpContentServiceImpl implements HelpContentService {

    private final HelpContentTopicMapper helpContentTopicMapper;

    private final HelpContentArticleMapper helpContentArticleMapper;

    private final HelpContentTopicRepository helpContentTopicRepository;

    private final HelpContentArticleRepository helpContentArticleRepository;

    @Override
    public List<HelpContentTopic> getAll() {
        return helpContentTopicRepository
            .getAllSystemHelpContent()
            .stream()
            .map(helpContentTopicMapper::entityToDomain)
            .sorted(Comparator.comparingLong(HelpContentTopic::getIndex))
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void updateAll(List<HelpContentTopic> helpContentTopics) {

        List<HelpContentTopicEntity> topics = helpContentTopics
            .stream()
            .map(helpContentTopicMapper::domainToEntity)
            .collect(Collectors.toList());

        List<HelpContentArticleEntity> articles = topics
            .stream()
            .map(topic -> {
                List<HelpContentArticleEntity> helpContentArticles = topic.getArticles();
                helpContentArticles.forEach(article -> article.setHelpContentTopic(topic));
                return helpContentArticles;
            })
            .flatMap(List::stream)
            .collect(Collectors.toList());

        helpContentArticleRepository.saveAll(articles);
        helpContentTopicRepository.saveAll(topics);

    }

    @Override
    @Transactional
    public HelpContentTopic createTopic(HelpContentTopic helpContentTopic) {
        HelpContentTopicEntity topic = helpContentTopicMapper
            .domainToEntity(helpContentTopic);
        topic.setSystem(true);

        return saveTopicInDb(topic);
    }

    @Override
    @Transactional
    public HelpContentTopic updateTopic(HelpContentTopic helpContentTopic) {
        HelpContentTopicEntity currentTopic = getTopicById(helpContentTopic.getId());
        currentTopic.setTitle(helpContentTopic.getTitle());
        currentTopic.setNotes(helpContentTopic.getNotes());
        currentTopic.setContents(helpContentTopic.getContents());
        return saveTopicInDb(currentTopic);
    }

    @Override
    @Transactional
    public void removeTopic(Long topicId) {
        AtomicLong index = new AtomicLong(1);
        helpContentTopicRepository.deleteById(topicId);
        List<HelpContentTopicEntity> topics = helpContentTopicRepository
            .getAllSystemHelpContent()
            .stream()
            .sorted(Comparator.comparingLong(HelpContentTopicEntity::getIndex))
            .peek(topicEntity -> topicEntity.setIndex(index.getAndIncrement()))
            .collect(Collectors.toList());

        helpContentTopicRepository.saveAll(topics);
    }

    @Override
    @Transactional
    public void removeArticle(Long articleId) {
        AtomicLong index = new AtomicLong(1);
        HelpContentArticleEntity article = getArticleById(articleId);
        HelpContentTopicEntity topic = article.getHelpContentTopic();
        helpContentArticleRepository.delete(article);

        List<HelpContentArticleEntity> articles = helpContentArticleRepository
            .getAllByHelpContentTopic(topic)
            .stream()
            .sorted(Comparator.comparingLong(HelpContentArticleEntity::getIndex))
            .peek(articleEntity -> articleEntity.setIndex(index.getAndIncrement()))
            .collect(Collectors.toList());

        helpContentArticleRepository.saveAll(articles);
    }

    @Override
    @Transactional
    public HelpContentArticle createArticle(HelpContentArticle helpContentArticle, Long topicId) {
        HelpContentTopicEntity topic = getTopicById(topicId);
        HelpContentArticleEntity article = helpContentArticleMapper.domainToEntity(helpContentArticle);
        article.setHelpContentTopic(topic);
        return saveArticleInDb(article);
    }

    @Override
    @Transactional
    public HelpContentArticle updateArticle(HelpContentArticle helpContentArticle) {
        HelpContentArticleEntity currentArticle = getArticleById(helpContentArticle.getId());
        currentArticle.setTitle(helpContentArticle.getTitle());
        currentArticle.setNotes(helpContentArticle.getNotes());
        currentArticle.setContents(helpContentArticle.getContents());
        return saveArticleInDb(currentArticle);
    }

    private HelpContentTopicEntity getTopicById(Long articleId) {
        return helpContentTopicRepository
            .findById(articleId)
            .orElseThrow(() -> {
                final String msg = String.format("Invalid #: %s", articleId.toString());
                throw new EntityNotFoundException(msg);
            });
    }

    private HelpContentArticleEntity getArticleById(Long topicId) {
        return helpContentArticleRepository
            .findById(topicId)
            .orElseThrow(() -> {
                final String msg = String.format("Invalid #: %s", topicId.toString());
                throw new EntityNotFoundException(msg);
            });
    }

    private HelpContentTopic saveTopicInDb(HelpContentTopicEntity article) {
        return helpContentTopicMapper
            .entityToDomain(helpContentTopicRepository
                .save(article));
    }

    private HelpContentArticle saveArticleInDb(HelpContentArticleEntity topic) {
        return helpContentArticleMapper
            .entityToDomain(helpContentArticleRepository
                .save(topic));
    }

}
