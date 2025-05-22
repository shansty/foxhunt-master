package com.itechart.foxhunt.api.competition.service;

import com.itechart.foxhunt.domain.entity.FoxPointEntity;
import com.itechart.foxhunt.api.competition.repository.FoxPointRepository;
import com.itechart.foxhunt.api.competition.dto.ActiveTracker;
import com.itechart.foxhunt.api.utils.GeomUtils;
import org.locationtech.jts.geom.Point;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PointVisitServiceImpl implements PointVisitService {

    private static final double DISTANCE_TO_VISIT = 10d;

    private final FoxPointRepository foxPointRepository;

    @Override
    public FoxPointEntity findVisitedFoxPoint(ActiveTracker activeTracker) {

        List<FoxPointEntity> foxPointEntities = foxPointRepository.findNotVisitedPointsInRadiusForCompetition(activeTracker.getCompetitionId(),
            activeTracker.getCurrentLocation(), DISTANCE_TO_VISIT, activeTracker.getParticipantId());

        if (foxPointEntities.isEmpty()) {
            return new FoxPointEntity();
        }

        return foxPointEntities.get(0);
    }

    @Override
    public boolean isPointVisited(Point pointForVisit, Point currentLocation) {
        return  GeomUtils.distanceInMeters(pointForVisit, currentLocation) < DISTANCE_TO_VISIT;
    }

}
