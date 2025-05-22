package com.itechart.foxhunt.api.feature.service;

import com.itechart.foxhunt.api.feature.dto.FeatureDto;
import com.itechart.foxhunt.domain.enums.FeatureType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class FeatureServiceImpl implements FeatureService {

    private final FeatureServiceCache featureServiceCache;

    @Override
    public boolean hasFeaturesEnabled(Long organizationId, List<FeatureType> featureTypes) {
        log.debug("Checking availability of features {} for organization {}...", featureTypes, organizationId);
        Set<FeatureType> enabledFeaturesTypes = featureServiceCache.findActiveFeaturesByOrganizationId(organizationId)
            .stream()
            .map(feature -> FeatureType.valueOf(feature.getName()))
            .collect(Collectors.toSet());
        return enabledFeaturesTypes.containsAll(featureTypes);
    }

    @Override
    public List<FeatureDto> getEnabledFeatures(long organizationId) {
        return featureServiceCache.findActiveFeaturesByOrganizationId(organizationId);
    }

}
