package com.itechart.foxhunt.api.user.dto;

import com.itechart.foxhunt.api.organization.Organization;
import com.itechart.foxhunt.domain.enums.Role;
import lombok.Data;

import java.util.Set;

@Data
public class InviteUsersRequest {

    private Organization organization;

    private Set<String> emails;

    private Set<Role> roles;
}
