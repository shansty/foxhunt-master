package com.itechart.foxhunt.api.user.dto;

import com.itechart.foxhunt.domain.enums.Role;
import lombok.Data;

import java.util.Arrays;
import java.util.List;

@Data
public class GetUsersRequest {

    private List<Role> roles = Arrays.asList(Role.values());
    private Long organizationId;
    private List<Long> userIds;
    private Boolean isActive;

    //Custom getters/setters required to provide the same functionality as @RequestParam
    public void setActive(Boolean active) {
        this.isActive = active;
    }

    public Boolean getActive() {
        return this.isActive;
    }

    public void setId(List<Long> id) {
        this.userIds = id;
    }

    public List<Long> getId() {
        return this.userIds;
    }

}
