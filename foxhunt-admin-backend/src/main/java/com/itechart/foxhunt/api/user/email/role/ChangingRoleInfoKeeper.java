package com.itechart.foxhunt.api.user.email.role;

import com.itechart.foxhunt.api.organization.Organization;
import com.itechart.foxhunt.api.user.dto.User;
import com.itechart.foxhunt.domain.entity.EmailTemplateEntity;
import com.itechart.foxhunt.domain.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChangingRoleInfoKeeper {

    private Organization organization;

    private User user;

    private Set<Role> oldRoles;

    private Set<Role> updatedRoles;

    private EmailTemplateEntity emailTemplateEntity;
}
