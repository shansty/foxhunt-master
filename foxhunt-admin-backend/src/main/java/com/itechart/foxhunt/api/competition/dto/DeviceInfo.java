package com.itechart.foxhunt.api.competition.dto;

import org.locationtech.jts.geom.Point;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeviceInfo {

    @NotNull(message = "Device coordinates must be set")
    private Point coordinates;
}
