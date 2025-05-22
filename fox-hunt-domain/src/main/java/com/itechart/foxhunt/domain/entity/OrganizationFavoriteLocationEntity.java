package com.itechart.foxhunt.domain.entity;

import com.itechart.foxhunt.domain.entity.location.LocationEntity;
import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "organization_favorite_locations", schema = "location")
public class OrganizationFavoriteLocationEntity {

  @EmbeddedId
  private OrganizationLocationCompositePK id;

  @OneToOne(optional = false, cascade = CascadeType.PERSIST)
  @JoinColumn(name = "location_id", referencedColumnName = "location_id")
  @MapsId("locationId")
  private LocationEntity locationEntity;
}
