package com.itechart.foxhunt.api.feature.service;

import com.itechart.foxhunt.api.feature.FeatureFeignClient;
import com.itechart.foxhunt.api.feature.dto.FeatureDto;
import com.itechart.foxhunt.api.feature.util.FeatureTestUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;


@ExtendWith({MockitoExtension.class, SpringExtension.class})
@ContextConfiguration(classes = {FeatureServiceCacheImpl.class})
@MockitoSettings(strictness = Strictness.LENIENT)
public class FeatureServiceCacheTest {

    @MockBean
    FeatureFeignClient featureFeignClient;

    @Autowired
    FeatureServiceCache featureServiceCache;

    @Test
    void expectReturnsAllEnabledFeaturesByPassedOrganization() {
        //given
        long organizationId = 1L;
        List<String> featureNames = List.of("LOCATION_MANAGEMENT", "YANDEX_MAPS");
        List<FeatureDto> expectedReturnedFeatures = FeatureTestUtil.createFeatureEntitiesWithCustomNames(featureNames);

        //when
        when(featureFeignClient.findActiveFeaturesByOrganizationId()).thenReturn(expectedReturnedFeatures);

        //then
        List<FeatureDto> returnedFeatured = featureServiceCache.findActiveFeaturesByOrganizationId(organizationId);
        assertEquals(expectedReturnedFeatures, returnedFeatured);
    }

}
