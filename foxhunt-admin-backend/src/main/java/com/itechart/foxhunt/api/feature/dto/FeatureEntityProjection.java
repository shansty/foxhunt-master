package com.itechart.foxhunt.api.feature.dto;

public interface FeatureEntityProjection {
    Long getId();
    Long getOrganizationId();
    String getName();
    String getDisplayName();
    String getDescription();
    Boolean getIsEnabledForOrganization();
    Boolean getIsGloballyEnabled();

    void setId(Long id);
    void setOrganizationId(Long organizationId);
    void setName(String name);
    void setDisplayName(String displayName);
    void setDescription(String description);
    void setIsEnabledForOrganization(Boolean isEnabledForOrganization);
    void setIsGloballyEnabled(Boolean isGloballyEnabled);
}
