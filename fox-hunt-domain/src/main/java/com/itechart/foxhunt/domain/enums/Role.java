package com.itechart.foxhunt.domain.enums;

import org.springframework.security.core.GrantedAuthority;

public enum Role {
    //Roles defined by importance. Order used in sorting
    SYSTEM_ADMIN, ORGANIZATION_ADMIN, TRAINER, PARTICIPANT;

    public static final String PREFIX = "ROLE_";

    public String getRoleString() {
        return PREFIX + toString();
    }

    public static Role authorityToRole(GrantedAuthority authority) {
        return Role.valueOf(authority.getAuthority().replace(PREFIX, ""));
    }
}
