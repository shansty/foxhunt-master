package com.itechart.foxhunt.api.core;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.itechart.foxhunt.api.core.ApiConstants.HEALTH;

@RequiredArgsConstructor
@RestController
@RequestMapping(value = HEALTH, produces = MediaType.APPLICATION_JSON_VALUE)
@Slf4j
public class HealthController {

    @Value( "${app-version}" )
    private String appVersion;

    @GetMapping()
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "App is up and running")
    })
    @Operation(summary = "Check if app is running and get the backend version", description = "Check if app is running and get the backend version")
    public ResponseEntity<String> getHealthCheck() {
        return ResponseEntity.ok(appVersion);
    }
}
