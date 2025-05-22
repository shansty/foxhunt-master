package com.itechart.foxhunt.api.competition.service;

import com.itechart.foxhunt.api.competition.dto.DeviceInfo;
import com.itechart.foxhunt.api.competition.dto.TrackDeviceResponse;
import com.itechart.foxhunt.api.core.ApiConstants;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(
    name = "device-tracker-service", url = "${client.device-tracker-service.baseUrl}",
    path = ApiConstants.ACTIVE_COMPETITIONS
)
public interface DeviceTrackerService {

    @PostMapping(ApiConstants.TRACK_DEVICE)
    TrackDeviceResponse trackDevice(@RequestHeader(value = "payload") String payloadHeader,
                                    @PathVariable("id") Long competitionId, @RequestBody DeviceInfo deviceInfo);

}
