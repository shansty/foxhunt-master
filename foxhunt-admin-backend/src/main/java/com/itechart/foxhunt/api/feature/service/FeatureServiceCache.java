package com.itechart.foxhunt.api.feature.service;

import com.itechart.foxhunt.api.feature.dto.FeatureDto;

import java.util.List;

public interface FeatureServiceCache {

    List<FeatureDto> findActiveFeaturesByOrganizationId(long organizationId);

}
