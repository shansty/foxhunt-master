package com.itechart.foxhunt.api.competition.service;

import com.itechart.foxhunt.api.competition.entity.SingleParticipantCompetitionEntity;
import com.itechart.foxhunt.api.competition.repository.SingleParticipantCompetitionRepository;
import com.itechart.foxhunt.api.location.dto.LocationFullDto;
import com.itechart.foxhunt.api.competition.dto.Competition;
import com.itechart.foxhunt.api.competition.dto.FoxPoint;
import com.itechart.foxhunt.api.competition.dto.SingleParticipantCompetition;
import com.itechart.foxhunt.api.user.dto.User;
import com.itechart.foxhunt.domain.enums.CompetitionStatus;
import org.locationtech.jts.geom.*;
import org.locationtech.jts.util.GeometricShapeFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SingleParticipantCompetitionServiceImpl implements
    SingleParticipantCompetitionService {

  private final SingleParticipantCompetitionRepository repository;

  @Override
  public Competition create(
      SingleParticipantCompetition spCompetition, User participant) {
    Competition competition = buildSingleParticipantCompetition(spCompetition, participant);
    SingleParticipantCompetitionEntity spCompetitionEntity = repository
        .save(new SingleParticipantCompetitionEntity(competition));
    competition.setId(-spCompetitionEntity.getId());
    spCompetitionEntity.setCompetition(competition);
    repository.save(spCompetitionEntity);
    return competition;
  }

  @Override
  public List<Competition> getAllByUserId(Long userId) {
    return repository.findAllByUserId(userId.toString()).stream()
        .map(SingleParticipantCompetitionEntity::getCompetition)
        .collect(Collectors.toList());
  }

    private Competition buildSingleParticipantCompetition(
        SingleParticipantCompetition spCompetition, User participant) {
        Competition competition = new Competition();
        competition.setParticipants(Collections.singleton(participant));
        competition.setFoxAmount(spCompetition.getFoxAmount());
        competition.setFoxDuration(60);// 1 min
        competition.setFoxRange(3000); //default for ARDF
        competition.setFrequency(spCompetition.getFrequency());
        competition.setHasSilenceInterval(spCompetition.isHasSilenceInterval());
        competition.setStatus(CompetitionStatus.RUNNING);
        competition.setCreatedBy(participant);
        competition.setStartDate(LocalDateTime.now());
        competition.setCreatedDate(LocalDateTime.now());
        competition.setLocation(buildLocation(spCompetition, participant));
        competition.setFoxPoints(createFoxPointList(competition));
        return competition;
    }
  @Override
  public SingleParticipantCompetitionEntity findById(Long id) {
    return repository.findById(id).orElseThrow(() -> {
      final String msg = String.format("Invalid #: %s", id.toString());
      throw new EntityNotFoundException(msg);
    });
  }

  //TODO: To be redesigned in FOX-468
  private LocationFullDto buildLocation(SingleParticipantCompetition spCompetition, User participant) {
    LocationFullDto location = new LocationFullDto();
    location.setCenter(spCompetition.getCenter());
    location.setCreatedBy(participant);
    location.setZoom(Integer.valueOf(17).byteValue());// Optimal zoom for 300m yandex map circle
    location.setCoordinates(createCircle(spCompetition));
    return location;
  }

  private Polygon createCircle(SingleParticipantCompetition spCompetition) {
    GeometricShapeFactory shapeFactory = new GeometricShapeFactory();
    shapeFactory.setNumPoints(15);
    shapeFactory.setCentre(spCompetition.getCenter().getCoordinate());
    shapeFactory.setHeight(0.004550D);// 300m height in yandex coordinates
    shapeFactory.setWidth(0.002696D);// 300m width in yandex coordinates
    return shapeFactory.createCircle();
  }

  private List<FoxPoint> createFoxPointList(Competition competition) {
    List<FoxPoint> foxPointList = new LinkedList<>();
    for (int i = 1; i <= competition.getFoxAmount(); i++) {
      FoxPoint foxPoint = new FoxPoint();
      foxPoint.setCoordinates(
          generatePointWithinPolygon(
              competition.getLocation().getCoordinates().getEnvelopeInternal()));
      foxPoint.setFrequency(generateFrequency(competition.getFrequency()));
      foxPoint.setIndex(i);
      foxPoint.setLabel("T" + i);
      foxPointList.add(foxPoint);
    }
    return foxPointList;
  }

  private Point generatePointWithinPolygon(Envelope envelope) {
    double yMin = envelope.getMinY();
    double yMax = envelope.getMaxY();
    double xMin = envelope.getMinX();
    double xMax = envelope.getMaxX();
    double lat = yMin + (Math.random() * (yMax - yMin));
    double lng = xMin + (Math.random() * (xMax - xMin));
    return new GeometryFactory().createPoint(new Coordinate(lng, lat));
  }

  private Double generateFrequency(Double competitionFrequency) {
    return competitionFrequency + Math.round((2 * Math.random() - 1) * 10) / 100;
  }
}
