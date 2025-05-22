package com.itechart.foxhunt.api.organization;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrganizationShortDto {
    private Long id;
    private String name;
    private String organizationDomain;
}
