package com.itechart.foxhunt.domain.entity;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Embeddable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrganizationUserRoleEntityPK implements Serializable {

  @Column(name = "user_id")
  private Long userId;

  @Column(name = "user_id")
  private Long roleId;

  @Column(name = "organization_id")
  private Long organizationId;
}

