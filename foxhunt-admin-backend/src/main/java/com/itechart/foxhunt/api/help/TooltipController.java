package com.itechart.foxhunt.api.help;

import com.itechart.foxhunt.api.feature.CheckFeature;
import com.itechart.foxhunt.api.help.service.TooltipService;
import com.itechart.foxhunt.api.help.dto.Tooltip;
import com.itechart.foxhunt.domain.enums.FeatureType;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.itechart.foxhunt.api.core.ApiConstants.ID;
import static com.itechart.foxhunt.api.core.ApiConstants.TOOLTIPS;

@RequiredArgsConstructor
@RestController
@RequestMapping(value = TOOLTIPS, produces = MediaType.APPLICATION_JSON_VALUE)
public class TooltipController {

    private final TooltipService tooltipService;

    @GetMapping
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Tooltips were received")
    })
    public ResponseEntity<List<Tooltip>> getAll() {
        return ResponseEntity.ok(tooltipService.getAll());
    }

    @PostMapping
    @CheckFeature(FeatureType.TOOLTIP_MANAGEMENT)
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Tooltips was created")
    })
    public ResponseEntity<Tooltip> create(@RequestBody Tooltip tooltip) {
        return ResponseEntity.status(HttpStatus.CREATED).body(tooltipService.create(tooltip));
    }

    @PutMapping(ID)
    @CheckFeature(FeatureType.TOOLTIP_MANAGEMENT)
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Tooltip was updated"),
        @ApiResponse(responseCode = "404", description = "No tooltip with this id")
    })
    public ResponseEntity<Tooltip> updateById(@PathVariable(value = "id")
                                                  Long tooltipId, @RequestBody Tooltip tooltip) {
        return ResponseEntity.ok(tooltipService.updateOne(tooltip, tooltipId));
    }

    @DeleteMapping(ID)
    @CheckFeature(FeatureType.TOOLTIP_MANAGEMENT)
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Tooltip has been removed")
    })
    public ResponseEntity<Void> deleteById(@PathVariable(value = "id") Long tooltipId) {
        tooltipService.deleteById(tooltipId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
