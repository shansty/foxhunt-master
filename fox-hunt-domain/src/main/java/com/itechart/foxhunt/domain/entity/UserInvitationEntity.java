package com.itechart.foxhunt.domain.entity;

import com.itechart.foxhunt.domain.enums.UserInvitationStatus;
import com.vladmihalcea.hibernate.type.basic.PostgreSQLEnumType;
import lombok.Data;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;

import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "user_invitation", schema = "fh_admin")
@TypeDef(
    name = "pgsql_enum",
    typeClass = PostgreSQLEnumType.class
)
public class UserInvitationEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "user_invitation_id")
  private Long userInvitationId;

  @Column(name = "start_date", nullable = false)
  private LocalDateTime startDate;

  @Column(name = "end_date", nullable = false)
  private LocalDateTime endDate;

  @Column(name = "transition_date")
  private LocalDateTime transitionDate;

  @Column(name = "token", nullable = false)
  private String token;

  @Column(name = "status", nullable = false)
  @Enumerated(EnumType.STRING)
  @Type(type = "pgsql_enum")
  private UserInvitationStatus status;

  @ManyToOne
  @JoinColumn(name = "user_id",
          referencedColumnName = "app_user_id",
          nullable = false)
  private UserEntity userEntity;

  @Column(name = "organization_id")
  private Long organizationId;

  @ManyToOne
  @JoinColumn(name = "email_template_id",
          referencedColumnName = "email_template_id",
          nullable = false)
  private EmailTemplateEntity emailTemplateEntity;

  @Column(name = "declination_reason", columnDefinition = "TEXT")
  private String declinationReason;

  @Column(name = "failure_reason", columnDefinition = "TEXT")
  private String failureReason;

}
