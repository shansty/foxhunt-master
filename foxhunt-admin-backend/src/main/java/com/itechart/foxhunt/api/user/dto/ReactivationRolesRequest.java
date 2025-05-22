package com.itechart.foxhunt.api.user.dto;

import com.itechart.foxhunt.domain.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReactivationRolesRequest {

    @NotEmpty
    private Set<@Valid Role> roles;

}
