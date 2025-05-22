package com.itechart.foxhunt.api.organization;

import com.itechart.foxhunt.api.user.dto.User;
import com.itechart.foxhunt.domain.enums.OrganizationStatus;

import java.util.List;

public interface OrganizationService {

    List<Organization> getAll(List<Long> orgIds);

    void updateInitialStatus(Long organizationId, User userRequestedActivation, OrganizationStatus status);

    Long getOrganizationIdByDomain(String domain);

    Organization findOrganizationById(Long id);

    Organization findOrganizationByDomain(String domain);

}
