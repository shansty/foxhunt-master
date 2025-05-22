package com.itechart.foxhunt.api.location.service;

import com.itechart.foxhunt.domain.entity.UserEntity;
import com.itechart.foxhunt.domain.entity.location.LocationEntity;
import com.itechart.foxhunt.domain.entity.location.LocationPackageEntity;

import java.util.Set;

public interface LocationPackageAssignmentService {

    void refreshAssociatedLocationPackages(Long organizationId, LocationEntity location, UserEntity user);

    void deleteLocationPackagesCascade(Long packageId); //TODO Drop it completely

    Set<LocationEntity> getAssociatedLocations(LocationPackageEntity entity, Long organizationId);
}
