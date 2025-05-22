package com.itechart.foxhunt.api.location.service;

import com.itechart.foxhunt.api.location.dao.LocationPackageRepository;
import com.itechart.foxhunt.api.location.dao.OrganizationLocationPackageRepository;
import com.itechart.foxhunt.api.location.dto.LocationPackageFullDto;
import com.itechart.foxhunt.api.location.dto.LocationShortDto;
import com.itechart.foxhunt.api.location.dto.OrganizationPackageAssignment;
import com.itechart.foxhunt.api.location.mapper.*;
import com.itechart.foxhunt.api.location.util.LocationTestUtils;
import com.itechart.foxhunt.api.user.mapper.UserMapperImpl;
import com.itechart.foxhunt.domain.entity.OrganizationLocationPackageCompositePK;
import com.itechart.foxhunt.domain.entity.OrganizationLocationPackageEntity;
import com.itechart.foxhunt.domain.entity.location.LocationPackageEntity;
import com.itechart.foxhunt.domain.enums.LocationPackageAccessType;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import javax.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith({MockitoExtension.class, SpringExtension.class})
@ContextConfiguration(classes = {
    OrganizationLocationPackageMapperImpl.class, LocationPackageMapperImpl.class,
    LocationMapperImpl.class, ForbiddenAreaMapperImpl.class, UserMapperImpl.class,
    OrganizationPackageAssignmentServiceImpl.class
})
public class OrganizationPackageAssignmentServiceTest {

    @MockBean
    OrganizationLocationPackageRepository orgLocationPackageRepository;

    @MockBean
    LocationPackageRepository locationPackageRepository;

    @Autowired
    OrganizationLocationPackageMapper orgLocationPackageMapper;

    @Autowired
    LocationPackageMapper locationPackageMapper;

    @Autowired
    LocationMapper locationMapper;

    @Autowired
    OrganizationPackageAssignmentService orgPackageAssignmentService;


    @Test
    void expectReturnsAllPrivateOrganizationPackageAssignments() {
        //given
        LocationPackageAccessType accessType = LocationPackageAccessType.PRIVATE;
        List<OrganizationLocationPackageEntity> orgLocationPackages = getOrganizationLocationPackageEntities();
        List<OrganizationPackageAssignment> expectedOrgPackageAssignments = orgLocationPackages.stream()
            .map(orgLocationPackageMapper::entityToDomain)
            .collect(Collectors.toList());

        //when
        when(orgLocationPackageRepository.findAllOrganizationPackagesByAccessType(accessType.name()))
            .thenReturn(orgLocationPackages);

        //then
        List<OrganizationPackageAssignment> orgPackageAssignments = orgPackageAssignmentService.getAllOrganizationPackageAssignments(accessType);
        assertEquals(expectedOrgPackageAssignments, orgPackageAssignments);
    }

    @Test
    void expectAssignsAllProvidedPackagesToOrganizations() {
        //given
        Long locationPackageId = 1L;
        Long organizationId = 1L;
        List<OrganizationPackageAssignment> orgPackageAssignments =
            List.of(createOrganizationPackageAssignment(organizationId, locationPackageId, LocationPackageAccessType.SYSTEM));

        //when
        when(locationPackageRepository.findById(locationPackageId)).thenReturn(Optional.of(new LocationPackageEntity()));
        orgPackageAssignmentService.assignAll(orgPackageAssignments);

        //then
        verify(orgLocationPackageRepository).saveAll(any());
    }

    @Test
    void expectEntityNotFoundExceptionWhenAssignNonExistingPackage() {
        //given
        Long locationPackageId = 1L;
        Long organizationId = 1L;
        List<OrganizationPackageAssignment> orgPackageAssignments =
            List.of(createOrganizationPackageAssignment(organizationId, locationPackageId, LocationPackageAccessType.SYSTEM));

        //when
        when(locationPackageRepository.findById(locationPackageId)).thenReturn(Optional.empty());

        //then
        assertThrows(EntityNotFoundException.class, () -> orgPackageAssignmentService.assignAll(orgPackageAssignments));
    }

    @Test
    void expectUnassignsAllProvidedPackagesFromOrganizations() {
        //given
        Long locationPackageId = 1L;
        Long organizationId = 1L;
        List<OrganizationPackageAssignment> orgPackageAssignments =
            List.of(createOrganizationPackageAssignment(organizationId, locationPackageId, LocationPackageAccessType.SYSTEM));

        //when
        orgPackageAssignmentService.unassignAll(orgPackageAssignments);

        //then
        verify(orgLocationPackageRepository).deleteAll(any());
    }

    private List<OrganizationLocationPackageEntity> getOrganizationLocationPackageEntities() {
        List<LocationPackageEntity> packagesToAssign = getPackagesToAssign();

        return packagesToAssign.stream().map(locationPackage -> {
            OrganizationLocationPackageEntity orgLocationPackageEntity = new OrganizationLocationPackageEntity();
            orgLocationPackageEntity.setId(new OrganizationLocationPackageCompositePK(1L, locationPackage.getLocationPackageId()));
            orgLocationPackageEntity.setLocationPackageEntity(locationPackage);
            return orgLocationPackageEntity;
        }).collect(Collectors.toList());
    }

    private List<LocationPackageEntity> getPackagesToAssign() {
        List<String> packageNames = List.of("Package 1", "Package 2");
        Set<LocationShortDto> packageLocations = LocationTestUtils.createLocationsWithCustomNames(List.of("Location 1", "Location 2"))
            .stream().map(locationMapper::convertToShortDto).collect(Collectors.toSet());

        return IntStream.range(0, packageNames.size())
            .mapToObj(index -> {
                LocationPackageFullDto orgLocationPackage = LocationTestUtils.createLocationPackageDto();
                orgLocationPackage.setLocationPackageId(index + 1L);
                orgLocationPackage.setName(packageNames.get(index));
                orgLocationPackage.setLocations(packageLocations);
                return locationPackageMapper.domainToEntity(orgLocationPackage);
            }).collect(Collectors.toList());
    }

    private OrganizationPackageAssignment createOrganizationPackageAssignment(Long organizationId, Long locationPackageId,
                                                                              LocationPackageAccessType accessType) {
        return OrganizationPackageAssignment.builder()
            .organizationId(organizationId)
            .locationPackageId(locationPackageId)
            .accessType(accessType)
            .build();
    }
}
