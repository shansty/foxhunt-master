package com.itechart.foxhunt.api.location.service;

import com.itechart.foxhunt.api.location.dto.OrganizationPackageAssignment;
import com.itechart.foxhunt.domain.enums.LocationPackageAccessType;

import java.util.List;

public interface OrganizationPackageAssignmentService {

    List<OrganizationPackageAssignment> getAllOrganizationPackageAssignments(LocationPackageAccessType accessType);

    void unassignAll(List<OrganizationPackageAssignment> unassignments);

    void assignAll(List<OrganizationPackageAssignment> assignments);

}
