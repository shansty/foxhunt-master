package com.itechart.foxhunt.api.organization;

import com.itechart.foxhunt.api.user.dto.User;
import com.itechart.foxhunt.domain.enums.OrganizationStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class OrganizationServiceImpl implements OrganizationService {

    private final OrganizationFeignClient organizationFeignClient;

    @Override
    public List<Organization> getAll(List<Long> orgIds) {
        log.info("Fetching organizations by ids: {}", orgIds);
        return organizationFeignClient.getAll(orgIds);
    }

    @Override
    public void updateInitialStatus(Long organizationId, User userRequestedActivation, OrganizationStatus newStatus) {
        log.info("Received request to update organization {} status from NEW to {}", organizationId, newStatus);
        OrganizationStatus currentStatus = organizationFeignClient.findById(organizationId).getStatus();
        if (currentStatus.equals(OrganizationStatus.NEW)) {
            switch (newStatus) {
                case ACTIVE -> {
                    log.debug("Performing initial activation for organization with ID {}", organizationId);
                    ActivateOrganizationRequest activateRequest = new ActivateOrganizationRequest(userRequestedActivation.getRoles());
                    organizationFeignClient.activateOrganization(organizationId, activateRequest);
                }
                case DECLINED -> {
                    log.debug("Declining organization with ID {} ", organizationId);
                    UpdateOrganizationStatusRequest updateStatusRequest = new UpdateOrganizationStatusRequest(newStatus);
                    organizationFeignClient.updateOrganizationStatus(organizationId, updateStatusRequest);
                }
            }
        } else {
            log.warn("Organization status is different from {}. Skipping updating of initial status", OrganizationStatus.NEW);
        }
    }

    @Override
    public Long getOrganizationIdByDomain(String domain) {
        log.info("Fetching organization id by domain: {}", domain);
        return organizationFeignClient.getOrganizationByDomain(domain).getId();
    }

    @Override
    public Organization findOrganizationById(Long id) {
        log.info("Fetching organization with id: {}", id);
        return organizationFeignClient.findById(id);
    }

    @Override
    public Organization findOrganizationByDomain(String domain) {
        return organizationFeignClient.getOrganizationByDomain(domain);
    }

}
