package com.itechart.foxhunt.domain.entity;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "email_template", schema = "fh_admin")
public class EmailTemplateEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "email_template_id")
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "subject")
    private String subject;

    @Column(name = "message")
    private String message;

}
