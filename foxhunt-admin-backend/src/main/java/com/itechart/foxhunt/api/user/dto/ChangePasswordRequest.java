package com.itechart.foxhunt.api.user.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class ChangePasswordRequest {

    @JsonProperty("currentPassword")
    private String oldPassword;

    private String newPassword;

}
