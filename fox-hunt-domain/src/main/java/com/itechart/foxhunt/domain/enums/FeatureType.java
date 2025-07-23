package com.itechart.foxhunt.domain.enums;

public enum FeatureType {
    LOCATION_MANAGEMENT,
    YANDEX_MAPS,
    LOCATION_PACKAGE_MANAGEMENT,
    TOOLTIP_MANAGEMENT,
    FAVORITE_LOCATION_MANAGEMENT,
    FORBIDDEN_AREA,
    HELP_CONTENT_MANAGEMENT,
    COMPETITION_TEMPLATE_MANAGEMENT,
    FOXORING_COMPETITION_TYPE;

    public static FeatureType parse(String feature) throws IllegalArgumentException {
        if (feature == null || feature.isBlank()) {
            throw new IllegalArgumentException("Can't parse null or blank string");
        }
        for (FeatureType featureType : FeatureType.values()) {
            if (featureType.name().equalsIgnoreCase(feature)) {
                return featureType;
            }
        }

        throw new IllegalArgumentException("There are no feature with name '" + feature + "' found");
    }
}
