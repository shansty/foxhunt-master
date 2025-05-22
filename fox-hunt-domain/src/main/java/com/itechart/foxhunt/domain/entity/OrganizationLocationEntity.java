package com.itechart.foxhunt.domain.entity;

import com.itechart.foxhunt.domain.entity.location.LocationEntity;
import lombok.Data;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import javax.persistence.*;

@Data
@Entity
@Table(name = "organization_locations", schema = "location")
public class OrganizationLocationEntity {

  @EmbeddedId
  private OrganizationLocationCompositePK id;

  @ManyToOne(optional = false, cascade = CascadeType.ALL)
  @JoinColumn(name = "location_id", referencedColumnName = "location_id")
  @MapsId("locationId")
  @Fetch(FetchMode.JOIN)
  private LocationEntity locationEntity;

}
