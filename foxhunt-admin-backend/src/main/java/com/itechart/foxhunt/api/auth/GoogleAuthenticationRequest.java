package com.itechart.foxhunt.api.auth;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class GoogleAuthenticationRequest {
    @NotBlank
    private String email;
    @NotBlank(message = "Organization domain is required")
    private String domain;
    private String firstName;
    private String lastName;
}
