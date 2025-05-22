package com.itechart.foxhunt.api.location;

import com.itechart.foxhunt.api.core.OrganizationId;
import com.itechart.foxhunt.api.location.dto.OrganizationPackageAssignment;
import com.itechart.foxhunt.api.location.dto.OrganizationPackageAssignmentRequest;
import com.itechart.foxhunt.api.location.service.OrganizationPackageAssignmentService;
import com.itechart.foxhunt.domain.enums.LocationPackageAccessType;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith({MockitoExtension.class, SpringExtension.class})
@ContextConfiguration(classes = {OrganizationLocationPackageController.class})
public class OrganizationLocationPackageControllerTest {

    @MockBean
    OrganizationPackageAssignmentService assignmentService;

    @Autowired
    OrganizationLocationPackageController orgLocationPackageController;

    //TODO Have to be reimplemented after adding shared location packages logic
    @Test
    void expectReturnsAllOrganizationPackageAssignments() {
        //given
        OrganizationId organizationId = new OrganizationId(1L);
        LocationPackageAccessType accessType = LocationPackageAccessType.SHARED;
        OrganizationPackageAssignment orgPackageAssignment = createOrganizationPackageAssignment(organizationId.getId(), 1L, accessType);
        List<OrganizationPackageAssignment> expectedFetchedOrgPackageAssignments = List.of(orgPackageAssignment);

        //when
        when(assignmentService.getAllOrganizationPackageAssignments(accessType))
            .thenReturn(expectedFetchedOrgPackageAssignments);

        //then
        ResponseEntity<List<OrganizationPackageAssignment>> fetchedOrgPackageAssignments = orgLocationPackageController.getAllOrganizationPackages(accessType);
        assertEquals(ResponseEntity.ok(expectedFetchedOrgPackageAssignments), fetchedOrgPackageAssignments);
    }

    @Test
    void expectAssignsAllProvidedPackagesToOrganization() {
        //given
        OrganizationId organizationId = new OrganizationId(1L);
        LocationPackageAccessType accessType = LocationPackageAccessType.SHARED;
        OrganizationPackageAssignment orgPackageAssignment = createOrganizationPackageAssignment(organizationId.getId(), 1L, accessType);
        List<OrganizationPackageAssignment> orgLocationAssignmentsToApply = List.of(orgPackageAssignment);

        //when

        //then
        ResponseEntity<List<OrganizationPackageAssignment>> assignAllResponse =
            orgLocationPackageController.assignAll(new OrganizationPackageAssignmentRequest(orgLocationAssignmentsToApply));
        assertEquals(ResponseEntity.ok().build(), assignAllResponse);
        verify(assignmentService).assignAll(any());
    }

    @Test
    void expectUnassignsAllProvidedPackagesFromOrganizations() {
        //given
        OrganizationId organizationId = new OrganizationId(1L);
        LocationPackageAccessType accessType = LocationPackageAccessType.SHARED;
        OrganizationPackageAssignment orgPackageAssignment = createOrganizationPackageAssignment(organizationId.getId(), 1L, accessType);
        List<OrganizationPackageAssignment> orgLocationAssignmentsToApply = List.of(orgPackageAssignment);

        //when

        //then
        ResponseEntity<List<OrganizationPackageAssignment>> assignAllResponse
            = orgLocationPackageController.unassignAll(new OrganizationPackageAssignmentRequest(orgLocationAssignmentsToApply));
        assertEquals(ResponseEntity.ok().build(), assignAllResponse);
        verify(assignmentService).unassignAll(any());
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
