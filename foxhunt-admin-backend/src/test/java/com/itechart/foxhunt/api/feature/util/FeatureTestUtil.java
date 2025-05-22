package com.itechart.foxhunt.api.feature.util;

import com.itechart.foxhunt.api.feature.dto.FeatureDto;

import java.util.List;
import java.util.stream.Collectors;

public class FeatureTestUtil {
    public static List<FeatureDto> createFeaturesWithCustomNames(List<String> featureNames) {
        return featureNames.stream()
            .map(name -> {
                FeatureDto feature = new FeatureDto();
                feature.setName(name);
                return feature;
            }).collect(Collectors.toList());
    }

    public static List<FeatureDto> createFeatureEntitiesWithCustomNames(List<String> featureNames) {
        return featureNames.stream()
            .map(name -> {
                FeatureDto feature = new FeatureDto();
                feature.setName(name);
                return feature;
            }).collect(Collectors.toList());
    }
}
