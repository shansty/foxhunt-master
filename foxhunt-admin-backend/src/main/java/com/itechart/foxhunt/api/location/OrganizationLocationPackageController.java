package com.itechart.foxhunt.api.location;

import com.itechart.foxhunt.api.core.ApiConstants;
import com.itechart.foxhunt.api.exception.BadRequestException;
import com.itechart.foxhunt.api.location.dto.OrganizationPackageAssignment;
import com.itechart.foxhunt.api.location.dto.OrganizationPackageAssignmentRequest;
import com.itechart.foxhunt.api.location.service.OrganizationPackageAssignmentService;
import com.itechart.foxhunt.domain.enums.LocationPackageAccessType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

import static com.itechart.foxhunt.domain.enums.LocationPackageAccessType.SHARED;

@RestController
@RequiredArgsConstructor
@Slf4j
@Secured(value = {ApiConstants.ROLE_SYSTEM_ADMIN})
@RequestMapping(value = ApiConstants.ALL_ORGANIZATION_PACKAGES, produces = MediaType.APPLICATION_JSON_VALUE)
public class OrganizationLocationPackageController {

    private final OrganizationPackageAssignmentService assignmentService;

    @GetMapping
    public ResponseEntity<List<OrganizationPackageAssignment>> getAllOrganizationPackages(@RequestParam LocationPackageAccessType accessType) {
        log.info("Returning all package assignments for accessType {}", accessType);
        if (!SHARED.equals(accessType)) {
            throw new BadRequestException("Retrieving system or private location package assignments is not supported right now");
        }
        return ResponseEntity.ok(assignmentService.getAllOrganizationPackageAssignments(accessType));
    }

    @PostMapping
    public ResponseEntity<List<OrganizationPackageAssignment>> assignAll(@Valid @RequestBody OrganizationPackageAssignmentRequest request) {
        log.info("{} new package assignments to be created by System Admin", request.getAssignments().size());
        assignmentService.assignAll(request.getAssignments());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping
    public ResponseEntity<List<OrganizationPackageAssignment>> unassignAll(@Valid @RequestBody OrganizationPackageAssignmentRequest request) {
        log.info("{} new package assignments to be deleted by System Admin", request.getAssignments().size());
        assignmentService.unassignAll(request.getAssignments());
        return ResponseEntity.ok().build();
    }
}
