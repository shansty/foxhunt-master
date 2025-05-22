package com.itechart.foxhunt.domain.entity;

import com.itechart.foxhunt.domain.entity.location.LocationPackageEntity;
import lombok.Data;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import javax.persistence.*;

@Data
@Entity
@Table(name = "organization_location_packages", schema = "location")
public class OrganizationLocationPackageEntity {

    @EmbeddedId
    private OrganizationLocationPackageCompositePK id;

    @ManyToOne(optional = false, cascade = CascadeType.ALL)
    @JoinColumn(name = "location_package_id", referencedColumnName = "location_package_id")
    @MapsId("locationPackageId")
    @Fetch(FetchMode.JOIN)
    private LocationPackageEntity locationPackageEntity;

}
