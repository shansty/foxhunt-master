package com.itechart.foxhunt.api.competition.dto;

import com.itechart.foxhunt.domain.entity.PathStoryEntity;
import org.locationtech.jts.geom.Geometry;

import java.time.LocalDateTime;

public interface ActiveTrackerProjection {
    LocalDateTime getGameTime();
    Long getParticipantId();
    Geometry getCurrentLocation();
    PathStoryEntity getPathStory();
    Boolean getIsDisconnected();
    Long getListenableFoxId();
}
