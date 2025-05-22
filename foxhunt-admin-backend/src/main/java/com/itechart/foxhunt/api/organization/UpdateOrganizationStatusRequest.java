package com.itechart.foxhunt.api.organization;

import com.itechart.foxhunt.domain.enums.OrganizationStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateOrganizationStatusRequest {
    private OrganizationStatus status;
}
