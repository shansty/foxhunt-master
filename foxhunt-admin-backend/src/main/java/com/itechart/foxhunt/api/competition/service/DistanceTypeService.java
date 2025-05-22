package com.itechart.foxhunt.api.competition.service;

import com.itechart.foxhunt.domain.entity.DistanceTypeEntity;

import java.util.List;

public interface DistanceTypeService {

    List<DistanceTypeEntity> getAll();

    DistanceTypeEntity findDistanceByName(String name);

}
