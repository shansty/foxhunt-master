package com.itechart.foxhunt.api.competition.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompetitionTemplateRequest {

    @NotBlank(message = "The field name is mandatory")
    private String name;

    private Long templateId;
}
