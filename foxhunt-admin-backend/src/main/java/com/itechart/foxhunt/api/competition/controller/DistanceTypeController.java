package com.itechart.foxhunt.api.competition.controller;

import com.itechart.foxhunt.api.competition.service.DistanceTypeService;
import com.itechart.foxhunt.api.core.ApiConstants;
import com.itechart.foxhunt.domain.entity.DistanceTypeEntity;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = ApiConstants.DISTANCE_TYPES, produces = MediaType.APPLICATION_JSON_VALUE)
public class DistanceTypeController {

    private final DistanceTypeService distanceTypeService;

    public DistanceTypeController(DistanceTypeService distanceTypeService) {
        this.distanceTypeService = distanceTypeService;
    }

    @GetMapping
    public List<DistanceTypeEntity> getAll() {
        return distanceTypeService.getAll();
    }
}
