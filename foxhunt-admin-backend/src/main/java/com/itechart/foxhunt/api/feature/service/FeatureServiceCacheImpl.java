package com.itechart.foxhunt.api.feature.service;

import com.itechart.foxhunt.api.feature.FeatureFeignClient;
import com.itechart.foxhunt.api.feature.dto.FeatureDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Used for cacheable methods
 * as @Cacheable works only for external method calls
 * self-invocation will not lead to an actual cache interception at runtime
 */

@Service
@RequiredArgsConstructor
@Slf4j
public class FeatureServiceCacheImpl implements FeatureServiceCache {

    private final FeatureFeignClient featureFeignClient;

    @Override
    @Cacheable(cacheNames = "activeOrganizationFeature", key = "#organizationId")
    public List<FeatureDto> findActiveFeaturesByOrganizationId(long organizationId) {
        log.debug("Requested list of active features in organization {}", organizationId);
        return featureFeignClient.findActiveFeaturesByOrganizationId();
    }

}
