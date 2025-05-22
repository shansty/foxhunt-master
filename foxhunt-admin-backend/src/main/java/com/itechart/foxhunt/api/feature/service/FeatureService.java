package com.itechart.foxhunt.api.feature.service;

import com.itechart.foxhunt.api.feature.dto.FeatureDto;
import com.itechart.foxhunt.domain.enums.FeatureType;

import java.util.List;

public interface FeatureService {

    boolean hasFeaturesEnabled(Long organizationId, List<FeatureType> featureTypes);

    List<FeatureDto> getEnabledFeatures(long organizationId);

}
