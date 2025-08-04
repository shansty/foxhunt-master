package com.itechart.foxhunt.api.competition.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import com.itechart.foxhunt.domain.entity.PathStoryEntity;
import lombok.NoArgsConstructor;
import org.locationtech.jts.geom.Geometry;
import org.locationtech.jts.geom.Point;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ActiveTracker {

    public ActiveTracker(Long participantId, LocalDateTime gameTime, Geometry currentLocation, Boolean isDisconnected) {
        this.participantId = participantId;
        this.gameTime = gameTime;
        this.currentLocation = (Point) currentLocation;
        this.isDisconnected = isDisconnected;
    }

    public ActiveTracker(Long participantId, LocalDateTime gameTime, Geometry currentLocation,
            PathStoryEntity pathStoryEntity, Boolean isDisconnected) {
        this.participantId = participantId;
        this.gameTime = gameTime;
        this.currentLocation = (Point) currentLocation;
        int foxIndex = pathStoryEntity.getActiveFox() == null ? 0 : pathStoryEntity.getActiveFox().getIndex();
        this.activeFoxInfo = ActiveFoxInfo.builder().foxPointIndex(foxIndex).build();
        this.rank = pathStoryEntity.getRank();
        this.isDisconnected = isDisconnected;
        this.listenableFoxId = pathStoryEntity.getListenableFox() != null
                ? pathStoryEntity.getListenableFox().getId()
                : null;
    }

     public ActiveTracker(Long participantId, LocalDateTime gameTime, Geometry currentLocation, Boolean isDisconnected, Long listenableFoxId) {
        this.participantId = participantId;
        this.gameTime = gameTime;
        this.currentLocation = (Point) currentLocation;
        this.isDisconnected = isDisconnected;
        this.listenableFoxId = listenableFoxId;
    }

    private Long participantId;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    private LocalDateTime gameTime;

    private Point currentLocation;
    private Long competitionId;
    private ActiveFoxInfo activeFoxInfo;
    private Boolean isDisconnected;
    private Long rank;

    @JsonInclude(JsonInclude.Include.ALWAYS)
    private Long listenableFoxId;
}
