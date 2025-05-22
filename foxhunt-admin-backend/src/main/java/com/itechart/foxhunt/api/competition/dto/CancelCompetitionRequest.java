package com.itechart.foxhunt.api.competition.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
public class CancelCompetitionRequest {

    @NotBlank(message = "Field reason is mandatory")
    @Size(max = 200, message = "Reason to cancel a competition cannot exceed 200 characters")
    private String reason;
}
