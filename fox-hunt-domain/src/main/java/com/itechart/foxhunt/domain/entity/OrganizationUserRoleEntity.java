package com.itechart.foxhunt.domain.entity;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "organization_user_role", schema = "fh_admin")
public class OrganizationUserRoleEntity {

  @EmbeddedId
  private OrganizationUserRoleEntityPK id;

  @OneToOne(optional = false, cascade = CascadeType.PERSIST)
  @JoinColumn(name = "user_id", referencedColumnName = "app_user_id")
  @MapsId("userId")
  private UserEntity userEntity;

  @OneToOne(optional = false, cascade = CascadeType.PERSIST)
  @JoinColumn(name = "role_id", referencedColumnName = "role_id")
  @MapsId("roleId")
  private RoleEntity roleEntity;

  @Column(name = "is_active", nullable = false)
  private boolean isActive;
}
