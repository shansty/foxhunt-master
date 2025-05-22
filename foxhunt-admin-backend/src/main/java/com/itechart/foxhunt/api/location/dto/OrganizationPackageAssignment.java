package com.itechart.foxhunt.api.location.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.itechart.foxhunt.domain.enums.LocationPackageAccessType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class OrganizationPackageAssignment {

    @NotNull(message = "(*) The field locationPackageId is mandatory")
    private Long locationPackageId;

    @NotNull(message = "(*) The field locationPackageId is mandatory")
    private Long organizationId;

    private LocationPackageAccessType accessType;
}
