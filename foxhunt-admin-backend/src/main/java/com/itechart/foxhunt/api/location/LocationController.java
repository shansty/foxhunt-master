package com.itechart.foxhunt.api.location;

import com.itechart.foxhunt.api.core.OrganizationId;
import com.itechart.foxhunt.api.location.config.LocationDocConstants;
import com.itechart.foxhunt.api.location.dto.CloneLocationRequest;
import com.itechart.foxhunt.api.location.dto.LocationFullDto;
import com.itechart.foxhunt.api.location.dto.LocationShortDto;
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

import javax.validation.Valid;
import java.util.List;

public interface LocationController {

    @Operation(summary = "Returns all locations available in current organization with pagination")
    ResponseEntity<Page<LocationShortDto>> getAllOrganizationLocations(@ParameterObject Pageable pageable,
                                                                       @Parameter(hidden = true) OrganizationId organizationId);

    @Operation(summary = "Returns all favorite locations in current organization")
    ResponseEntity<List<LocationShortDto>> getAllFavoriteLocations(@Parameter(hidden = true) OrganizationId organizationId,
                                                                   @ParameterObject Pageable pageable);

    @Operation(summary = "Returns all locations available in current organization with pagination")
    ResponseEntity<Page<LocationShortDto>> getOrganizationLocationByName(@ParameterObject Pageable pageable,
                                                                         @Parameter String name,
                                                                         @Parameter(hidden = true) OrganizationId organizationId);

    @Operation(summary = "Returns location by id")
    @ApiResponse(
        responseCode = "200",
        description = "Location found",
        content = @Content(examples = @ExampleObject(LocationDocConstants.SINGLE_LOCATION)))
    LocationFullDto getLocationById(final Long id, @Parameter(hidden = true) OrganizationId organizationId);

    @Operation(summary = "Creates new location")
    @ApiResponse(
        responseCode = "200",
        description = "Location created successfully",
        content = @Content(examples = @ExampleObject(LocationDocConstants.SINGLE_LOCATION)))
    ResponseEntity<LocationFullDto> createLocation(
        @RequestBody(content = @Content(examples = @ExampleObject(LocationDocConstants.CREATE_LOCATION_REQUEST)))
        @Valid final LocationFullDto location,
        @Parameter(hidden = true) OrganizationId organizationId);

    ResponseEntity<LocationFullDto> cloneLocation(@Parameter(hidden = true) OrganizationId organizationId,
                                                  @Parameter(name = "sourceId", description = "id of location that have to be cloned")
                                                  Long sourceLocationId,
                                                  @Valid CloneLocationRequest cloneRequest);

    @Operation(summary = "Updates location")
    @ApiResponse(
        responseCode = "200",
        description = "Location updated",
        content = @Content(examples = @ExampleObject(LocationDocConstants.SINGLE_LOCATION)))
    ResponseEntity<LocationFullDto> updateLocation(
        @RequestBody(content = @Content(examples = @ExampleObject(LocationDocConstants.UPDATE_LOCATION_REQUEST)))
        @Valid final LocationFullDto location,
        final Long id,
        @Parameter(hidden = true) OrganizationId organizationId);

    @Operation(summary = "Marks location as favorite")
    ResponseEntity<Long> toggleFavoriteLocation(final Long id,
                                                @Parameter(hidden = true) OrganizationId organizationId);

    @Operation(summary = "Deletes location")
    ResponseEntity<Long> deleteLocation(final Long id,
                                        @Parameter(hidden = true) OrganizationId organizationId);
}
