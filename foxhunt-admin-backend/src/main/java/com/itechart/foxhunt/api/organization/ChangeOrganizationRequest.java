package com.itechart.foxhunt.api.organization;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ChangeOrganizationRequest {
    private String domain;
}
