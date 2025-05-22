package com.itechart.foxhunt.api.organization;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.itechart.foxhunt.api.location.dto.LocationFullDto;
import com.itechart.foxhunt.domain.enums.OrganizationStatus;
import com.itechart.foxhunt.domain.enums.OrganizationType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.ZonedDateTime;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Organization {

    private Long id;

    @Size(min = 2, max = 50)
    @NotNull
    private String name;

    private Set<LocationFullDto> favoriteLocations;

    private boolean isSystem;

    private String organizationDomain;

    private Integer approximateEmployeesNumber;

    private String legalAddress;

    private String actualAddress;

    private OrganizationStatus status;

    private OrganizationType type;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss[.SSS]X")
    private ZonedDateTime created;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss[.SSS]X")
    private ZonedDateTime lastStatusChange;
}
