package com.itechart.foxhunt.api.location.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import com.itechart.foxhunt.api.user.dto.User;
import com.itechart.foxhunt.domain.enums.LocationPackageAssignmentType;
import com.itechart.foxhunt.domain.enums.LocationPackageAccessType;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.Polygon;
import lombok.Data;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.Set;

@Data
public class LocationPackageFullDto {

    private Long locationPackageId;

    @NotNull(message = "Location package name")
    @Size(min = 5, max = 40, message = "The record cannot exceed 40 characters (at least 5 characters are required)")
    private String name;

    @Size(max = 512, message = "The record cannot exceed 512 characters")
    private String description;

    @NotNull(message = "Center point must always be set")
    private Point center;

    @NotNull(message = "Polygon is mandatory")
    private Polygon coordinates;

    @Max(value = 19, message = "Zoom value must not exceed 19")
    @Min(value = 0, message = "Zoom value must not be negative")
    @NotNull(message = "Zoom must always be set")
    private Byte zoom;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    private LocalDateTime creationDate;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    private LocalDateTime updateDate;

    private User createdBy;

    private User updatedBy;

    private LocationPackageAccessType accessType;

    private Set<LocationShortDto> locations;

    @JsonProperty("updatable")
    private Boolean isUpdatable;

    @NotNull(message = "Creation type must always be set")
    private LocationPackageAssignmentType assignmentType;

    private Boolean exactAreaMatch;
}
