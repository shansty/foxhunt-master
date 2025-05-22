package com.itechart.foxhunt.api.location;

import com.itechart.foxhunt.api.core.OrganizationId;
import com.itechart.foxhunt.api.location.config.LocationPackageDocConstants;
import com.itechart.foxhunt.api.location.dto.LocationPackageFullDto;
import com.itechart.foxhunt.api.location.dto.LocationPackageShortDto;
import com.itechart.foxhunt.domain.enums.LocationPackageAccessType;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springdoc.api.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

public interface LocationPackageController {

    @Operation(summary = "Returns all location packages in current organization with pagination")
    ResponseEntity<Page<LocationPackageShortDto>> getAllOrganizationPackages(@ParameterObject Pageable pageable,
                                                                             @Parameter(hidden = true) OrganizationId organizationId);

    @Operation(summary = "Returns all location packages by access type")
    ResponseEntity<List<LocationPackageShortDto>> getAllPackages(LocationPackageAccessType accessType);

    @Operation(summary = "Returns location package by id")
    @ApiResponse(
        responseCode = "200",
        description = "Location package found",
        content = @Content(examples = @ExampleObject(value = LocationPackageDocConstants.SINGLE_LOCATION_PACKAGE)))
    LocationPackageFullDto getOne(@PathVariable Long id,
                                  @Parameter(hidden = true) OrganizationId organizationId);

    @Operation(summary = "Creates new location package")
    @ApiResponse(
        responseCode = "201",
        description = "Location package created",
        content = @Content(examples = @ExampleObject(value = LocationPackageDocConstants.SINGLE_LOCATION_PACKAGE)))
    ResponseEntity<LocationPackageFullDto> createOne(
        @RequestBody(content = @Content(examples = @ExampleObject(value = LocationPackageDocConstants.MODIFY_LOCATION_PACKAGE_REQUEST))) final LocationPackageFullDto locationPackage,
        @Parameter(hidden = true) OrganizationId organizationId);

    @Operation(summary = "Updates location package")
    @ApiResponse(
        responseCode = "200",
        description = "Location package updated",
        content = @Content(examples = @ExampleObject(value = LocationPackageDocConstants.SINGLE_LOCATION_PACKAGE)))
    ResponseEntity<LocationPackageFullDto> updateOne(
        @RequestBody(content = @Content(examples = @ExampleObject(value = LocationPackageDocConstants.MODIFY_LOCATION_PACKAGE_REQUEST)))
        final LocationPackageFullDto locationPackage,
        final Long id,
        @Parameter(hidden = true) OrganizationId organizationId);

    @Operation(summary = "Deletes location package")
    ResponseEntity<Long> deleteOne(final Long id,
                                   @Parameter(hidden = true) OrganizationId organizationId);
}
