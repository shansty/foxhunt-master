package com.itechart.foxhunt.api.organization;

import com.itechart.foxhunt.api.user.dto.OrganizationUserRoleShortDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActivateOrganizationRequest {
    Set<OrganizationUserRoleShortDto> roles;
}
