package com.itechart.foxhunt.api.user.dto;

import com.itechart.foxhunt.domain.entity.RoleEntity;

import java.time.LocalDateTime;
import java.util.Set;

public interface UserProjection {
    Long getId();

    String getFirstName();

    String getLastName();

    LocalDateTime getDateOfBirth();

    String getCountry();

    String getCity();

    String getPassword();

    String getEmail();

    Set<RoleEntity> getRoles();

    Boolean getIsActivated();

    LocalDateTime getActivatedSince();

    String getAvatar();


    void setId(Long id);

    void setFirstName(String firstName);

    void setLastName(String lastName);

    void setDateOfBirth(LocalDateTime dateOfBirth);

    void setCountry(String country);

    void setCity(String city);

    void setPassword(String password);

    void setEmail(String email);

    void setRoles(Set<RoleEntity> roles);

    void setIsActivated(Boolean isActivated);

    void setActivatedSince(LocalDateTime activatedSince);

    void setAvatar(String avatar);

}
