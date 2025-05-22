package com.itechart.foxhunt.api.location.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrganizationPackageAssignmentRequest {

    List<OrganizationPackageAssignment> assignments;

}
