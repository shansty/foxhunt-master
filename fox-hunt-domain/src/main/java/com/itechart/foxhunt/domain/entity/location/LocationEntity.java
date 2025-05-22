package com.itechart.foxhunt.domain.entity.location;

import com.itechart.foxhunt.domain.entity.ForbiddenAreaEntity;
import com.itechart.foxhunt.domain.entity.UserEntity;
import com.itechart.foxhunt.domain.utils.SRIDConstants;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.Polygon;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@Entity
@Table(name = "locations", schema = "location")
public class LocationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "location_id")
    private Long id;

    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @Column(nullable = true, unique = false)
    private String description;

    @Column(name = "center", nullable = false, columnDefinition = SRIDConstants.GEOMETRY_POINT_6708)
    private Point center;

    @Column(name = "coordinates", nullable = false, columnDefinition = SRIDConstants.GEOMETRY_POLYGON_6708)
    private Polygon coordinates;

    @Column(name = "zoom", nullable = false)
    private Byte zoom;

    @Column(name = "is_global", nullable = false)
    private Boolean isGlobal;

    @Column(name = "is_cloned", nullable = false)
    private Boolean isCloned = false;

    @CreationTimestamp
    @Column(name = "created_date", nullable = false)
    private LocalDateTime createdDate;

    @Column(name = "updated_date")
    private LocalDateTime updatedDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by",
            referencedColumnName = "app_user_id",
            nullable = false,
            updatable = false)
    private UserEntity createdBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "updated_by", referencedColumnName = "app_user_id")
    private UserEntity updatedBy;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "location_id")
    private List<ForbiddenAreaEntity> forbiddenAreas;

    @Column(name = "revision", nullable = false)
    @Version
    private Integer revision = 0;
}
