package com.itechart.foxhunt.api.auth;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class AuthenticationRequest {
    @NotBlank
    private String email;
    @NotBlank
    private String password;
    @NotBlank(message = "Organization domain is required")
    private String domain;
}
