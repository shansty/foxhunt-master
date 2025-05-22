package com.itechart.foxhunt.api.utils;

import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;

import java.util.List;
import java.util.stream.Collectors;

public class GeomUtils {

    private static final double EARTH_RADIUS_M = 6371d * 1000;

    private GeomUtils() {
        throw new IllegalStateException("Utility class");
    }

    public static double convertGeomDistToDecartDistMeters(Double geomDist) {
        return Math.toRadians(geomDist) * EARTH_RADIUS_M;
    }

    public static double distanceInMeters(Point point1, Point point2) {

        return convertGeomDistToDecartDistMeters(point1.distance(point2));
    }

    public static Point getPoint(String point) {
        GeometryFactory factory = new GeometryFactory(new PrecisionModel());
        String pointData = point.substring(point.indexOf("(") + 1, point.indexOf(")"));
        String[] pointCoordinates = pointData.split(" ");
        return factory.createPoint(new Coordinate(Double.parseDouble(pointCoordinates[0]), Double.parseDouble(pointCoordinates[1])));
    }

    public static List<Point> getPoints(List<String> coordinates) {
        GeometryFactory factory = new GeometryFactory(new PrecisionModel());
        return coordinates.parallelStream()
            .map(coordinate -> coordinate.substring(coordinate.indexOf("(") + 1, coordinate.indexOf(")")))
            .map(coordinate -> {
                String[] point = coordinate.split(" ");
                return factory.createPoint(new Coordinate(Double.parseDouble(point[0]), Double.parseDouble(point[1])));
            })
            .collect(Collectors.toList());
    }
}
