package com.itechart.foxhunt.api.competition.service;

import com.itechart.foxhunt.api.competition.dto.Competition;
import com.itechart.foxhunt.api.competition.dto.FoxPoint;
import com.itechart.foxhunt.api.location.dao.LocationRepository;
import com.itechart.foxhunt.api.user.dto.User;
import com.itechart.foxhunt.api.utils.GeomUtils;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.Polygon;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.Stream;

import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.toMap;

@Service
@RequiredArgsConstructor
public class CompetitionPathGeneratorServiceImpl implements CompetitionPathGeneratorService {
    private final float PROJECTION_POINT_DISTANCE = 250.0F;
    private final float PROJECTION_POINT_ANGLE = 45.0F;
    private final int AVERAGE_REACH_POINT_MINUTES = 7;
    private final int RANGE_REACH_POINT_MINUTES = 3;
    private final int MINUTES_TO_SECONDS_CONVERSION = 60;

    private final LocationRepository locationRepository;

    @Override
    public Map<Integer, Map<User, Point>> generateParticipantsPathPoints(Competition competitionToEmulate) {
        Set<User> participants = competitionToEmulate.getParticipants();
        List<Point> foxes = competitionToEmulate.getFoxPoints().stream()
            .map(FoxPoint::getCoordinates)
            .collect(Collectors.toList());

        return participants.stream()
            .map(participant -> createParticipantPath(competitionToEmulate.getStartPoint(), foxes, competitionToEmulate.getFinishPoint())
                .entrySet().stream()
                .collect(
                    Collectors.toMap(Map.Entry::getKey,
                        pointBySaveTime -> new AbstractMap.SimpleEntry<>(participant, pointBySaveTime.getValue()))))
            .flatMap(userPathMap -> userPathMap.entrySet().stream())
            .collect(
                groupingBy(Map.Entry::getKey,
                    toMap(userLocationAtSecond -> userLocationAtSecond.getValue().getKey(),
                        userLocationAtSecond -> userLocationAtSecond.getValue().getValue())));
    }

    private Map<Integer, Point> createParticipantPath(Point startPoint, List<Point> foxes, Point finishPoint) {
        List<Point> pointsToVisit = getPointsToVisit(startPoint, foxes, finishPoint);
        List<Point> generatedPoints = IntStream
            .range(0, pointsToVisit.size() - 1)
            .mapToObj(i -> generatePathPoints(pointsToVisit.get(i), pointsToVisit.get(i + 1)))
            .flatMap(Collection::stream)
            .collect(Collectors.toList());
        return IntStream.range(0, generatedPoints.size())
            .boxed()
            .collect(Collectors.toMap(i -> i + 1, generatedPoints::get));
    }

    private List<Point> getPointsToVisit(Point startPoint, List<Point> foxes, Point finishPoint) {
        Collections.shuffle(foxes);
        return Stream
            .of(List.of(startPoint), foxes, List.of(finishPoint))
            .flatMap(Collection::stream)
            .collect(Collectors.toList());
    }

    private List<Point> generatePathPoints(Point startPoint, Point endPoint) {
        Polygon polygonToBuildPath = createPolygonToGeneratePoints(startPoint, endPoint);
        int pointsNumber = getPointsNumber();
        List<String> pointsFromPolygon = locationRepository.getRandomCoordinatesFromArea(polygonToBuildPath, pointsNumber);
        List<Point> generatedPoints = GeomUtils.getPoints(pointsFromPolygon);

        return Stream.of(List.of(startPoint), generatedPoints, List.of(endPoint))
            .flatMap(Collection::stream)
            .collect(Collectors.toList());
    }

    private int getPointsNumber() {
        int minutesToReachPoint = new Random()
            .ints(AVERAGE_REACH_POINT_MINUTES - RANGE_REACH_POINT_MINUTES, AVERAGE_REACH_POINT_MINUTES + RANGE_REACH_POINT_MINUTES)
            .findFirst().getAsInt();
        return minutesToReachPoint * MINUTES_TO_SECONDS_CONVERSION;
    }


    private Polygon createPolygonToGeneratePoints(Point startPoint, Point endPoint) {
        String startPointTopProjection = locationRepository
            .getProjectedPoint(startPoint, PROJECTION_POINT_DISTANCE, PROJECTION_POINT_ANGLE);
        String startPointBottomProjection = locationRepository
            .getProjectedPoint(startPoint, -PROJECTION_POINT_DISTANCE, PROJECTION_POINT_ANGLE);

        Point polygonTopCorner = GeomUtils.getPoint(startPointTopProjection);
        Point polygonBottomCorner = GeomUtils.getPoint(startPointBottomProjection);

        List<Point> polygonCornerPoints = Arrays.asList(startPoint, polygonTopCorner, endPoint, polygonBottomCorner, startPoint);
        Coordinate[] polygonCoordinates = polygonCornerPoints.stream().map(Point::getCoordinate).toArray(Coordinate[]::new);
        return new GeometryFactory().createPolygon(polygonCoordinates);
    }
}
