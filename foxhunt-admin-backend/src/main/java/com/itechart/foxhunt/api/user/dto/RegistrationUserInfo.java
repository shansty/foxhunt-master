package com.itechart.foxhunt.api.user.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Data
public class RegistrationUserInfo {

    @Size(min = 2, max = 50, message = "Name should contains a least 2 symbols and at most 50 symbols")
    private String firstName;

    @Size(min = 2, max = 50, message = "Last name should contains a least 2 symbols and at most 50 symbols")
    private String lastName;

    @NotNull(message = "Email cannot be null")
    @Email(message = "Please input correct email")
    private String email;

    private String country;

    private String city;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    private String domain;

}
