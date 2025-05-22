package com.itechart.foxhunt.api.location.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.itechart.foxhunt.domain.enums.LocationPackageAccessType;
import com.itechart.foxhunt.domain.enums.LocationPackageAssignmentType;
import lombok.Data;
import lombok.experimental.Accessors;

import java.util.Set;

@Data
@Accessors(chain = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class LocationPackageShortDto {

    private Long locationPackageId;

    private String name;

    private String description;

    private UserShortDto createdBy;

    private UserShortDto updatedBy;

    private LocationPackageAccessType accessType;

    private LocationPackageAssignmentType assignmentType;

    @JsonProperty("updatable")
    private Boolean isUpdatable;

    private Boolean exactAreaMatch;

    private Set<LocationShortDto> locations;
}
