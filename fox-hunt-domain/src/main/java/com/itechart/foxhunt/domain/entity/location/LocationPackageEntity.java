package com.itechart.foxhunt.domain.entity.location;

import com.itechart.foxhunt.domain.entity.UserEntity;
import com.itechart.foxhunt.domain.enums.LocationPackageAssignmentType;
import com.itechart.foxhunt.domain.enums.LocationPackageAccessType;
import com.itechart.foxhunt.domain.utils.SRIDConstants;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.Polygon;
import com.vladmihalcea.hibernate.type.basic.PostgreSQLEnumType;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Set;

@Data
@Entity
@NoArgsConstructor
@Table(name = "location_packages", schema = "location")
@TypeDef(
        name = "pgsql_enum",
        typeClass = PostgreSQLEnumType.class
)
public class LocationPackageEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "location_package_id")
    private Long locationPackageId;

    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "zoom", nullable = false)
    private Byte zoom;

    @Column(name = "center", nullable = false, columnDefinition = SRIDConstants.GEOMETRY_POINT_6708)
    private Point center;

    @Column(name = "coordinates", columnDefinition = SRIDConstants.GEOMETRY_POLYGON_6708)
    private Polygon coordinates;

    @CreationTimestamp
    @Column(name = "creation_date", nullable = false)
    private LocalDateTime creationDate;

    @Column(name = "update_date")
    private LocalDateTime updateDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by",
            referencedColumnName = "app_user_id",
            nullable = false,
            updatable = false)
    private UserEntity createdBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "updated_by",
            referencedColumnName = "app_user_id")
    private UserEntity updatedBy;

    @Type(type = "pgsql_enum")
    @Enumerated(EnumType.STRING)
    @Column(name = "access_type", nullable = false)
    private LocationPackageAccessType accessType;

    @ManyToMany(cascade = {CascadeType.MERGE})
    @JoinTable(name = "location_package_locations", schema = "location",
            joinColumns = @JoinColumn(name = "location_package_id"),
            inverseJoinColumns = @JoinColumn(name = "location_id"))
    private Set<LocationEntity> locations;

    @Type(type = "pgsql_enum")
    @Enumerated(EnumType.STRING)
    @Column(name = "assignment_type", nullable = false)
    private LocationPackageAssignmentType assignmentType;

    @Column(name = "exact_area_match", nullable = false)
    private Boolean exactAreaMatch;
}
