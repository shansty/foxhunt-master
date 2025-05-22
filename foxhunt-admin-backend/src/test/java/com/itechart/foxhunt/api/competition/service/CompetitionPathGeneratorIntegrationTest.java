package com.itechart.foxhunt.api.competition.service;

import com.itechart.foxhunt.api.AbstractMigrationTest;
import com.itechart.foxhunt.api.competition.dto.Competition;
import com.itechart.foxhunt.api.competition.dto.FoxPoint;
import com.itechart.foxhunt.api.competition.util.CompetitionTestUtils;
import com.itechart.foxhunt.api.user.dto.User;
import org.locationtech.jts.geom.Point;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class CompetitionPathGeneratorIntegrationTest extends AbstractMigrationTest {

    @Autowired
    CompetitionPathGeneratorService pathGeneratorService;

    @Test
    void expectReturnsCompetitionParticipantsPathThatBeginsWithStartPointAndEndsWithFinishPoint() {
        //given
        Competition competition = CompetitionTestUtils.getCompetition();

        //when

        //then
        Map<Integer, Map<User, Point>> generatedParticipantsPaths = pathGeneratorService.generateParticipantsPathPoints(competition);

        Map<User, Point> lastParticipantsPositions = getLastParticipantsPositions(generatedParticipantsPaths);
        lastParticipantsPositions.forEach((participant, position) -> assertEquals(competition.getFinishPoint(), position));
        Map<User, Point> firstParticipantsPositions = getFirstParticipantsPositions(generatedParticipantsPaths);
        firstParticipantsPositions.forEach((participant, position) -> assertEquals(competition.getStartPoint(), position));
    }

    @Test
    void expectParticipantsPathsContainsAllFoxPoints() {
        //given
        Competition competition = CompetitionTestUtils.getCompetition();
        List<Point> foxPoints = competition.getFoxPoints().stream()
            .map(FoxPoint::getCoordinates)
            .collect(Collectors.toList());

        //when

        //then
        Map<Integer, Map<User, Point>> generatedParticipantsLocationsByReachTime = pathGeneratorService.generateParticipantsPathPoints(competition);
        Map<User, List<Point>> participantsPaths = generatedParticipantsLocationsByReachTime.values().stream()
            .map(Map::entrySet)
            .flatMap(Collection::stream)
            .collect(
                Collectors.groupingBy(participantLocation -> participantLocation.getKey(),
                    Collectors.mapping(participantLocation -> participantLocation.getValue(), Collectors.toList()))
            );

        participantsPaths.forEach((user, pathPoints) ->
            org.assertj.core.api.Assertions.assertThat(pathPoints).containsAll(foxPoints));
    }

    private Map<User, Point> getFirstParticipantsPositions(Map<Integer, Map<User, Point>> participantsPositionsByTime) {
        return participantsPositionsByTime.entrySet().stream()
            .min((Map.Entry.comparingByKey())).get()
            .getValue();
    }

    private Map<User, Point> getLastParticipantsPositions(Map<Integer, Map<User, Point>> participantsPositionsByTime) {
        return participantsPositionsByTime.entrySet().stream()
            .max((Map.Entry.comparingByKey())).get()
            .getValue();
    }

}
