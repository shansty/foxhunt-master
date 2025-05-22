package com.itechart.foxhunt.api.competition.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.itechart.foxhunt.domain.enums.NotificationType;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TrackDeviceResponse {
    private NotificationType notificationType;
    private FoxPoint foxPoint;
}
