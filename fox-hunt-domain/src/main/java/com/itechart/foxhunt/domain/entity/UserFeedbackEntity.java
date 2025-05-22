package com.itechart.foxhunt.domain.entity;

import java.time.LocalDateTime;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "user_feedback", schema = "fh_admin")
public class UserFeedbackEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "user_feedback_id")
  private Long id;

  @Column(name = "ranking", nullable = false)
  private Integer ranking;

  @Column(name = "send_date", nullable = false)
  private LocalDateTime sendDate;

  @Column(name = "comment")
  private String comment;

  @Column(name = "has_read")
  private boolean hasRead;

  @ManyToOne
  @JoinColumn(name = "user_id",
      referencedColumnName = "app_user_id",
      nullable = false)
  private UserEntity user;

  @Column(name = "organization_id", nullable = false)
  private Long organizationId;

}

