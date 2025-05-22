package com.itechart.foxhunt.api.feature.service;

import com.itechart.foxhunt.api.feature.dto.FeatureDto;
import com.itechart.foxhunt.api.feature.util.FeatureTestUtil;
import com.itechart.foxhunt.domain.enums.FeatureType;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith({MockitoExtension.class, SpringExtension.class})
@ContextConfiguration(classes = {FeatureServiceImpl.class})
public class FeatureServiceTest {

    @MockBean
    FeatureServiceCache featureServiceCache;

    @Autowired
    FeatureService featureService;

    @Test
    void expectReturnsTrueWhenAllPassedFeaturesEnabled() {
        //given
        long organizationId = 1L;
        List<FeatureDto> enabledFeatures = FeatureTestUtil.createFeaturesWithCustomNames(List.of("LOCATION_MANAGEMENT", "YANDEX_MAPS"));
        List<FeatureType> featuresToCheck = List.of(FeatureType.LOCATION_MANAGEMENT, FeatureType.YANDEX_MAPS);

        //when
        when(featureServiceCache.findActiveFeaturesByOrganizationId(organizationId))
            .thenReturn(enabledFeatures);

        //then
        boolean isAllPassedFeaturesEnabled = featureService.hasFeaturesEnabled(organizationId, featuresToCheck);
        assertTrue(isAllPassedFeaturesEnabled);
    }

    @Test
    void expectReturnsFalseWhenNotAllPassedFeaturesEnabled() {
        //given
        long organizationId = 1L;
        List<FeatureDto> enabledFeatures = FeatureTestUtil.createFeaturesWithCustomNames(List.of("LOCATION_MANAGEMENT", "YANDEX_MAPS"));
        List<FeatureType> featuresToCheck = List.of(FeatureType.LOCATION_MANAGEMENT, FeatureType.YANDEX_MAPS, FeatureType.LOCATION_PACKAGE_MANAGEMENT);

        //when
        when(featureServiceCache.findActiveFeaturesByOrganizationId(organizationId))
            .thenReturn(enabledFeatures);

        //then
        boolean isAllPassedFeaturesEnabled = featureService.hasFeaturesEnabled(organizationId, featuresToCheck);
        assertFalse(isAllPassedFeaturesEnabled);
    }

    @Test
    void expectReturnsAllFeaturesByPassedOrganization() {
        //given
        long organizationId = 1L;
        List<String> featureNames = List.of("LOCATION_MANAGEMENT", "YANDEX_MAPS");
        List<FeatureDto> expectedReturnedFeatures = FeatureTestUtil.createFeaturesWithCustomNames(featureNames);

        //when
        when(featureServiceCache.findActiveFeaturesByOrganizationId(organizationId)).thenReturn(expectedReturnedFeatures);

        //then
        List<FeatureDto> returnedFeatures = featureService.getEnabledFeatures(organizationId);
        assertEquals(expectedReturnedFeatures, returnedFeatures);
    }

}
