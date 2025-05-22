package com.itechart.foxhunt.domain.entity.location.function;

import com.itechart.foxhunt.domain.entity.OrganizationLocationCompositePK;
import com.itechart.foxhunt.domain.entity.location.LocationEntity;
import lombok.Data;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.hibernate.annotations.Immutable;

import javax.persistence.*;

@Data
@Entity
@Immutable
public class OrganizationLocationFunctionResult {

    @EmbeddedId
    private OrganizationLocationCompositePK id;

    @OneToOne(optional = false, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "location_id", referencedColumnName = "location_id")
    @MapsId("locationId")
    @Fetch(FetchMode.JOIN)
    private LocationEntity locationEntity;

    @Column(name = "name")
    private String name;

    @Column(name = "is_global")
    private Boolean isGlobal;

    @Column(name = "is_favorite")
    private Boolean isFavorite;

    @Column(name = "is_virtual")
    private Boolean isVirtual;

    @Column(name = "is_updatable")
    private Boolean isUpdatable;
}
