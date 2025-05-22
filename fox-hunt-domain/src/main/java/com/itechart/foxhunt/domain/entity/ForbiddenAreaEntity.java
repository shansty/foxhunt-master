package com.itechart.foxhunt.domain.entity;

import com.itechart.foxhunt.domain.utils.SRIDConstants;
import org.locationtech.jts.geom.Polygon;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Data
@NoArgsConstructor
@Entity
@Table(name = "forbidden_area", schema = "fh_admin")
public class ForbiddenAreaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "forbidden_area_id")
    private Long id;

    @Column(name = "coordinates", nullable = false, columnDefinition = SRIDConstants.GEOMETRY_POLYGON_6708)
    private Polygon coordinates;
}
