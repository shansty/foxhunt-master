package com.itechart.foxhunt.domain.entity;

import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.Polygon;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompetitionLocation {

    private Long id;

    private Long revision;

    private String name;

    private String description;

    private Point center;

    private Polygon coordinates;

    private Byte zoom;

    private List<Polygon> forbiddenAreas = new ArrayList<>();
}
