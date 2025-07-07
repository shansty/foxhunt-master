package com.itechart.foxhunt.api.competition.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonView;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import com.itechart.foxhunt.api.location.dto.LocationFullDto;
import com.itechart.foxhunt.api.user.dto.User;
import com.itechart.foxhunt.api.competition.CompetitionFrequency;
import com.itechart.foxhunt.domain.entity.DistanceTypeEntity;
import com.itechart.foxhunt.domain.enums.CompetitionStatus;
import org.locationtech.jts.geom.Point;
import lombok.Data;

import javax.validation.constraints.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ModifyCompetition {

    private Long id;

    @Size(min = 5, max = 40, message = "Name cannot exceed 40 characters (at least 5 characters are required)")
    private String name;

    @Size(max = 512, message = "Notes cannot exceed 512 characters ")
    private String notes;

    private Long coachId;

    @Max(value = 5, message = "Number of foxes must not exceed 5")
    @Min(value = 0, message = "Number of foxes must not be negative")
    private Byte foxAmount;

    @JsonView(View.UpcomingCompetition.class)
    private List<FoxPoint> foxPoints;

    private Point startPoint;

    private Point finishPoint;

    @Future(message = "The date of the launch can be neither past nor present")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    private LocalDateTime startDate;

    @PastOrPresent(message = "Future cannot be set for the date of creation")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    private LocalDateTime createdDate;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    private LocalDateTime updatedDate;

    private LocationFullDto location;

    private DistanceTypeEntity distanceType;

    private Set<Long> participantsId;

    private CompetitionStatus status;

    @Min(value = 20, message = "Fox duration should be more than 20 seconds")
    private Integer foxDuration;

    @Min(value = 10, message = "Fox range should be more than 10 meters")
    @Max(value = 3000, message = "Fox range should be less than 10 meters")
    private Integer foxRange;

    private boolean hasSilenceInterval;

    @CompetitionFrequency()
    private Double frequency;

    private Boolean isPrivate;

    private User createdBy;
}
