package com.itechart.foxhunt.api.help.dto;

import lombok.Data;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Data
public class Tooltip {

    private Long id;

    @NotNull(message = "(*) The field code is mandatory")
    @Size(max = 155, message = "The record cannot exceed 155 characters")
    private String code;

    @NotNull(message = "(*) The field message is mandatory")
    private String message;
}
