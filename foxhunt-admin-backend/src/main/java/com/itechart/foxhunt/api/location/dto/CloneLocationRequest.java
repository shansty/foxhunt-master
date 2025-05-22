package com.itechart.foxhunt.api.location.dto;

import lombok.Data;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Data
public class CloneLocationRequest {
    @NotNull
    @Size(min = 5, max = 40)
    private String name;
}
