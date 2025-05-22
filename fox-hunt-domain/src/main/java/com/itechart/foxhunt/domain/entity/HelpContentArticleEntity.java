package com.itechart.foxhunt.domain.entity;

import com.vladmihalcea.hibernate.type.json.JsonBinaryType;
import lombok.Data;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;

import javax.persistence.*;
import java.util.Map;

@Data
@Entity
@Table(name = "help_content_article", schema = "fh_admin")
@TypeDef(name = "json", typeClass = JsonBinaryType.class)
public class HelpContentArticleEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "help_content_article_id")
    private Long id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "notes")
    private String notes;

    @Type(type = "json")
    @Column(name = "contents", columnDefinition = "json", nullable = false)
    private Map<String, Object> contents;

    @Column(name = "index", nullable = false)
    private Long index;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "help_content_topic_id",
            referencedColumnName = "help_content_topic_id",
            nullable = false)
    private HelpContentTopicEntity helpContentTopic;
}
