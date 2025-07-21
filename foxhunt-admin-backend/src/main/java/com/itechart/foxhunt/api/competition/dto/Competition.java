package com.itechart.foxhunt.api.competition.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
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
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import javax.validation.constraints.Future;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.PastOrPresent;
import javax.validation.constraints.Size;
import lombok.Data;

@Data
@JsonInclude(Include.NON_NULL)
public class Competition {

    private Long id;

    @NotNull(message = "(*) The field name is mandatory")
    @Size(min = 5, max = 40, message = "Name cannot exceed 40 characters (at least 5 characters are required)")
    private String name;

    @Size(max = 512, message = "Notes cannot exceed 512 characters ")
    private String notes;

    @NotNull(message = "Coach has to be assigned")
    private User coach;

    @Max(value = 5, message = "Number of foxes must not exceed 5")
    @Min(value = 0, message = "Number of foxes must not be negative")
    @NotNull(message = "Amount of foxes must be set")
    private Byte foxAmount;

    @JsonView(View.UpcomingCompetition.class)
    private List<FoxPoint> foxPoints;

    @NotNull(message = "Start Point must be set")
    private Point startPoint;

    @NotNull(message = "Finish Point must be set")
    private Point finishPoint;

    @NotNull(message = "The start date is mandatory")
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

    @NotNull(message = "A location should be chosen")
    private LocationFullDto location;

    @NotNull(message = "A distance type should be chosen")
    private DistanceTypeEntity distanceType;

    private Set<User> participants;

    private CompetitionStatus status;

    @NotNull(message = "Fox duration must be set")
    @Min(value = 20, message = "Fox duration should be more than 20 seconds")
    private Integer foxDuration;

    @NotNull(message = "Fox range must be set")
    @Min(value = 10, message = "Fox range should be more than 10 meters")
    @Max(value = 3000, message = "Fox range should be less than 3000 meters")
    private Integer foxRange;

    @Size(max = 9, message = "Duration format cannot exceed 9 characters")
    private String expectedCompetitionDuration;

    private boolean hasSilenceInterval;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    private LocalDateTime actualStartDate;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    private LocalDateTime actualFinishDate;

    @Size(max = 200, message = "Reason to finish a competition cannot exceed 200 characters ")
    private String stoppingReason;

    @Size(max = 200, message = "Reason to cancel a competition cannot exceed 200 characters ")
    private String cancellationReason;

    @CompetitionFrequency()
    private Double frequency;

    private Boolean isPrivate;

    private User createdBy;
}
