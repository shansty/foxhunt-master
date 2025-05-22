package com.itechart.foxhunt.api.organization;

import com.itechart.foxhunt.api.config.SystemAdminFeignClientConfiguration;
import com.itechart.foxhunt.api.core.ApiConstants;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(
    name = "organization-service", url = "${client.organization-service.baseUrl}",
    path = ApiConstants.ORGANIZATIONS, configuration = SystemAdminFeignClientConfiguration.class
)
public interface OrganizationFeignClient {

    @GetMapping
    List<Organization> getAll(@RequestParam("id") List<Long> orgIds);

    @GetMapping(ApiConstants.ID)
    Organization findById(@PathVariable("id") Long organizationId);

    @PutMapping(ApiConstants.ACTIVATION_BY_ID)
    Organization activateOrganization(@PathVariable("id") Long organizationId,
                                      @RequestBody ActivateOrganizationRequest request);

    @GetMapping(ApiConstants.ORGANIZATION_BY_DOMAIN)
    Organization getOrganizationByDomain(@PathVariable("domain") String domain);

    @PutMapping(ApiConstants.ORGANIZATION_STATUS)
    Organization updateOrganizationStatus(@PathVariable("id") Long organizationId,
                                          @RequestBody UpdateOrganizationStatusRequest request);

}
