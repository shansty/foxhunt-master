package com.itechart.foxhunt.api.user.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.itechart.foxhunt.api.location.dto.UserShortDto;
import com.itechart.foxhunt.domain.entity.RoleEntity;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class OrganizationUserRole {

    private Long organizationId;

    private UserShortDto user;

    private RoleEntity role;

}
