package com.itechart.foxhunt.api.competition.service;

import com.itechart.foxhunt.api.competition.dto.ActiveTracker;
import com.itechart.foxhunt.domain.entity.FoxPointEntity;
import org.locationtech.jts.geom.Point;

public interface PointVisitService {

    FoxPointEntity findVisitedFoxPoint( ActiveTracker activeTracker);

    boolean isPointVisited(Point pointForVisit, Point currentLocation);
}
