package com.itechart.foxhunt.api.user.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class InvitationDeclineReason {
    @NotBlank
    private String declinationReason;
}
