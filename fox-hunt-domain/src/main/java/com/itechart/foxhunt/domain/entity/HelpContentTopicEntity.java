package com.itechart.foxhunt.domain.entity;

import com.vladmihalcea.hibernate.type.json.JsonBinaryType;
import lombok.Data;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;

import javax.persistence.*;
import java.util.List;
import java.util.Map;

@Data
@Entity
@Table(name = "help_content_topic", schema = "fh_admin")
@TypeDef(name = "json", typeClass = JsonBinaryType.class)
public class HelpContentTopicEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "help_content_topic_id")
    private Long id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "notes")
    private String notes;

    @Type(type = "json")
    @Column(name = "contents", columnDefinition = "json")
    private Map<String, Object> contents;

    @Column(name = "is_system", nullable = false)
    private boolean isSystem;

    @Column(name = "index", nullable = false)
    private Long index;

    @OneToMany(mappedBy = "helpContentTopic", cascade = CascadeType.ALL)
    @OrderBy("index asc")
    private List<HelpContentArticleEntity> articles;
}
