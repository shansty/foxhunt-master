package com.itechart.foxhunt.domain.entity.location.function;

import com.itechart.foxhunt.domain.entity.OrganizationLocationPackageCompositePK;
import com.itechart.foxhunt.domain.entity.location.LocationPackageEntity;
import com.itechart.foxhunt.domain.enums.LocationPackageAccessType;
import com.itechart.foxhunt.domain.enums.LocationPackageAssignmentType;
import lombok.Data;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.Type;

import javax.persistence.*;

@Data
@Entity
@Immutable
public class OrganizationLocationPackageFunctionResult {

    @EmbeddedId
    private OrganizationLocationPackageCompositePK id;

    @OneToOne(optional = false, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "location_package_id", referencedColumnName = "location_package_id")
    @MapsId("locationPackageId")
    @Fetch(FetchMode.JOIN)
    private LocationPackageEntity locationPackageEntity;

    @Column(name = "name")
    private String name;

    @Type(type = "pgsql_enum")
    @Enumerated(EnumType.STRING)
    @Column(name = "assignment_type", nullable = false)
    private LocationPackageAssignmentType assignmentType;

    @Type(type = "pgsql_enum")
    @Enumerated(EnumType.STRING)
    @Column(name = "access_type", nullable = false)
    private LocationPackageAccessType accessType;

    @Column(name = "is_updatable")
    private Boolean isUpdatable;
}
