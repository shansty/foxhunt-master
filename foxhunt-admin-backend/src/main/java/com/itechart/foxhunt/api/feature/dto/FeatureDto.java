package com.itechart.foxhunt.api.feature.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class FeatureDto {
    private Long id;

    private Long organizationId;

    private String name;

    private String displayName;

    private String description;

    @JsonProperty("enabled")
    private Boolean isEnabled;
}
