package com.itechart.foxhunt.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrganizationLocationPackageCompositePK implements Serializable {

  @Column(name = "organization_id")
  private Long organizationId;

  @Column(name = "location_package_id")
  private Long locationPackageId;
}
