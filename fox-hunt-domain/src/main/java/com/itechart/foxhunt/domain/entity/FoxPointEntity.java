package com.itechart.foxhunt.domain.entity;

import org.locationtech.jts.geom.Point;
import java.math.BigDecimal;
import java.util.Set;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.validation.constraints.NotNull;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Data
@Entity
@Table(name = "fox_point", schema = "fh_admin")
public class FoxPointEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "fox_point_id")
    private Long id;

    @Column(name = "index", nullable = false)
    private Integer index;

    @Column(name = "label", nullable = true)
    private String label;

    @Column(name = "coordinates", nullable = false, columnDefinition = "geometry(Point,6708)")
    private Point coordinates;

    @Column(name = "circle_center", nullable = false, columnDefinition = "geometry(Point,6708)")
    private Point circleCenter;
    
    @OneToMany(mappedBy = "activeFox", orphanRemoval = true)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<PathStoryEntity> story;

    @OneToMany(mappedBy = "foxPoint", orphanRemoval = true)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<CompetitionResultEntity> competitionResult;

    @Column(name = "frequency", nullable = false, precision = 10, scale = 2)
    private BigDecimal frequency;
}
