package com.itechart.foxhunt.api.location.dto;

import org.locationtech.jts.geom.Polygon;
import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class ForbiddenArea {

    private Long id;

    @NotNull(message = "Polygon is mandatory")
    private Polygon coordinates;
}
