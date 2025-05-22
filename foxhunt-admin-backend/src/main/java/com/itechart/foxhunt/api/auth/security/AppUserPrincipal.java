package com.itechart.foxhunt.api.auth.security;

import com.itechart.foxhunt.domain.entity.UserEntity;
import org.apache.commons.lang3.StringUtils;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;
import java.util.Objects;

public class AppUserPrincipal extends User {

    private final UserEntity userEntity;

    public AppUserPrincipal(UserEntity userEntity,
        Collection<? extends GrantedAuthority> authorities) {
        super(userEntity.getEmail(), Objects.requireNonNullElse(userEntity.getPassword(), StringUtils.EMPTY), authorities);
        this.userEntity = userEntity;
    }

    public UserEntity getUserEntity() {
        return userEntity;
    }
}
