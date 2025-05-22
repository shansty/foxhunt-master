package com.itechart.foxhunt.api.location.service;

import com.itechart.foxhunt.api.location.dao.LocationPackageRepository;
import com.itechart.foxhunt.api.location.dao.OrganizationLocationPackageRepository;
import com.itechart.foxhunt.api.location.dto.OrganizationPackageAssignment;
import com.itechart.foxhunt.api.location.mapper.OrganizationLocationPackageMapper;
import com.itechart.foxhunt.domain.entity.OrganizationLocationPackageCompositePK;
import com.itechart.foxhunt.domain.entity.OrganizationLocationPackageEntity;
import com.itechart.foxhunt.domain.entity.location.LocationPackageEntity;
import com.itechart.foxhunt.domain.enums.LocationPackageAccessType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrganizationPackageAssignmentServiceImpl implements OrganizationPackageAssignmentService {

    private final OrganizationLocationPackageRepository orgLocationPackageRepository;

    private final LocationPackageRepository locationPackageRepository;

    private final OrganizationLocationPackageMapper mapper;

    @Override
    public List<OrganizationPackageAssignment> getAllOrganizationPackageAssignments(LocationPackageAccessType accessType) {
        log.info("Trying to get all package assignments with accessType {}", accessType.name());
        List<OrganizationLocationPackageEntity> data = orgLocationPackageRepository.findAllOrganizationPackagesByAccessType(accessType.name());
        log.info("Found {} package assignments", data.size());
        List<OrganizationPackageAssignment> result = data.stream()
            .map(element -> mapper.entityToDomain(element)).collect(Collectors.toList());
        log.debug("Package assignments prepared, returning....");
        return result;
    }

    @Override
    @Transactional
    public void assignAll(List<OrganizationPackageAssignment> assignments) {
        log.info("Performing assignment of location packages to organizations...");
        List<OrganizationLocationPackageEntity> entities = assignments.stream().map(element -> {
            log.info("Assigning location package {} to organization {}", element.getLocationPackageId(), element.getOrganizationId());
            LocationPackageEntity packageToAssign = locationPackageRepository.findById(element.getLocationPackageId())
                .orElseThrow(() -> new EntityNotFoundException(String.format("Location package with id %s not found", element.getLocationPackageId())));

            OrganizationLocationPackageEntity entity = new OrganizationLocationPackageEntity();
            entity.setId(new OrganizationLocationPackageCompositePK(element.getOrganizationId(), element.getLocationPackageId()));
            entity.setLocationPackageEntity(packageToAssign);
            return entity;
        }).collect(Collectors.toList());

        orgLocationPackageRepository.saveAll(entities);
        log.info("Location packages assigned to organizations");
    }

    @Override
    @Transactional
    public void unassignAll(List<OrganizationPackageAssignment> unassignments) {
        log.info("Performing unassignment of location packages to organizations...");

        List<OrganizationLocationPackageEntity> entities = unassignments.stream().map(element -> {
            log.info("Unassigning location package {} from organization {}", element.getLocationPackageId(), element.getOrganizationId());
            OrganizationLocationPackageEntity entity = new OrganizationLocationPackageEntity();
            entity.setId(new OrganizationLocationPackageCompositePK(element.getOrganizationId(), element.getLocationPackageId()));
            return entity;
        }).collect(Collectors.toList());
        orgLocationPackageRepository.deleteAll(entities);
        log.info("Location packages unassigned from organizations");
    }
}
