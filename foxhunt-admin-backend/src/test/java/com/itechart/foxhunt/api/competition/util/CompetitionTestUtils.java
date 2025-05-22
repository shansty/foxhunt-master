package com.itechart.foxhunt.api.competition.util;

import com.itechart.foxhunt.api.competition.dto.Competition;
import com.itechart.foxhunt.api.competition.dto.FoxPoint;
import com.itechart.foxhunt.api.location.dto.LocationFullDto;
import com.itechart.foxhunt.api.user.dto.User;
import com.itechart.foxhunt.domain.entity.DistanceTypeEntity;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.Polygon;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class CompetitionTestUtils {

    private static GeometryFactory geometryFactory = new GeometryFactory();

    public static Competition getCompetition() {
        Competition competition = new Competition();
        Point startPoint = geometryFactory.createPoint(new Coordinate(53.91202004539712, 27.545315849597745));
        Point finishPoint = geometryFactory.createPoint(new Coordinate(53.89249677054796, 27.57950336272447));

        competition.setName("Competition Template competition 3.5");
        competition.setNotes("Template competition");
        competition.setParticipants(getParticipants());
        competition.setFoxAmount((byte) 5);
        competition.setFoxPoints(getFoxPoints());
        competition.setStartPoint(startPoint);
        competition.setFinishPoint(finishPoint);
        competition.setDistanceType(getDistanceType());
        competition.setLocation(getLocation());

        return competition;
    }

    public static Set<User> getParticipants() {
        List<String> participantsNames = List.of("Nikolai", "Anton", "Ilya", "Boris");

        return participantsNames.stream().map(name -> {
            User participant = new User();
            participant.setFirstName(name);
            return participant;
        }).collect(Collectors.toSet());
    }

    private static List<FoxPoint> getFoxPoints() {
        List<Point> foxesCoordinates = List.of(
            geometryFactory.createPoint(new Coordinate(53.90676862782519, 27.583558353615462)),
            geometryFactory.createPoint(new Coordinate(53.8863788546968, 27.56815626231955)),
            geometryFactory.createPoint(new Coordinate(53.90106796340739, 27.546445536024248)),
            geometryFactory.createPoint(new Coordinate(53.90990919713174, 27.564237034857058)),
            geometryFactory.createPoint(new Coordinate(53.90972212324937, 27.53811053911928))
        );
        return foxesCoordinates.stream().map(coordinate -> {
            FoxPoint foxPoint = new FoxPoint();
            foxPoint.setCoordinates(coordinate);
            return foxPoint;
        }).collect(Collectors.toList());
    }

    private static DistanceTypeEntity getDistanceType() {
        DistanceTypeEntity distanceTypeEntity = new DistanceTypeEntity();
        distanceTypeEntity.setName("M5");
        distanceTypeEntity.setMaxNumberOfFox(5);
        distanceTypeEntity.setDistanceLength(10000);
        return distanceTypeEntity;
    }

    private static LocationFullDto getLocation() {
        LocationFullDto locationFullDto = new LocationFullDto();

        locationFullDto.setName("Template Location");
        locationFullDto.setCoordinates(getLocationCoordinates());
        locationFullDto.setZoom((byte) 15);

        return locationFullDto;
    }

    private static Polygon getLocationCoordinates() {
        Coordinate[] locationCoordinates = new Coordinate[]{
            new Coordinate(53.96354674282926, 27.549833862304673),
            new Coordinate(53.8865452214503, 27.438597290039052),
            new Coordinate(53.832965387060156, 27.54434069824216),
            new Coordinate(53.913309295032924, 27.71737536621093),
            new Coordinate(53.96354674282926, 27.549833862304673)
        };

        return geometryFactory.createPolygon(locationCoordinates);
    }
}
