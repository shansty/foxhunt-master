package com.itechart.foxhunt.api.competition.service;

import com.itechart.foxhunt.api.exception.BadRequestException;
import com.itechart.foxhunt.domain.entity.DistanceTypeEntity;
import com.itechart.foxhunt.api.competition.repository.DistanceTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DistanceTypeServiceImpl implements DistanceTypeService {

    private final DistanceTypeRepository distanceTypeRepository;

    @Override
    public List<DistanceTypeEntity> getAll() {
        return distanceTypeRepository.findAll();
    }

    @Override
    @Cacheable(cacheNames = "distanceType", key = "#name")
    public DistanceTypeEntity findDistanceByName(String name) {
        return distanceTypeRepository.findByName(name)
            .orElseThrow(() -> new BadRequestException(String.format("Distance with name %s does not exist", name)));
    }
}
