package com.itechart.foxhunt.api.user.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.itechart.foxhunt.domain.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class OrganizationUserRoleShortDto {

    @NotNull
    private Long organizationId;

    @NotNull
    private Long userId;

    private Role role;

    @JsonIgnore
    private Boolean isActive;
}
