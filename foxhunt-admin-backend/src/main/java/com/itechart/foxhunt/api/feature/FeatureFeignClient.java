package com.itechart.foxhunt.api.feature;

import com.itechart.foxhunt.api.config.CommonUserFeignClientConfiguration;
import com.itechart.foxhunt.api.core.ApiConstants;
import com.itechart.foxhunt.api.feature.dto.FeatureDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@FeignClient(
    name = "feature-service", url = "${client.feature-service.baseUrl}",
    path = ApiConstants.ORGANIZATION_FEATURES, configuration = CommonUserFeignClientConfiguration.class
)
public interface FeatureFeignClient {

    @GetMapping(ApiConstants.CURRENT)
    List<FeatureDto> findActiveFeaturesByOrganizationId();

}
