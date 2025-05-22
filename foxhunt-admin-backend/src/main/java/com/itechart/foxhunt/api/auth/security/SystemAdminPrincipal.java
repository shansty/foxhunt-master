package com.itechart.foxhunt.api.auth.security;

import com.itechart.foxhunt.api.user.dto.SystemAdmin;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;

public class SystemAdminPrincipal extends User {

    private final SystemAdmin systemAdmin;

    public SystemAdminPrincipal(SystemAdmin systemAdmin,
                                Collection<? extends GrantedAuthority> authorities) {
        super(systemAdmin.getEmail(), systemAdmin.getPassword(), authorities);
        this.systemAdmin = systemAdmin;
    }

}
