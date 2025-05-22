package com.itechart.foxhunt.api.location.service;

import com.itechart.foxhunt.api.location.dto.LocationPackageFullDto;
import com.itechart.foxhunt.domain.entity.location.LocationPackageEntity;
import com.itechart.foxhunt.domain.enums.LocationPackageAccessType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface OrganizationLocationPackageService {

  Page<LocationPackageFullDto> getAllOrganizationPackages(Pageable pageable, Long organizationId);

  List<LocationPackageEntity> getAllSystemPackages(LocationPackageAccessType accessType);

  LocationPackageFullDto findById(Long packageId, Long organizationId);

  void delete(Long id, Long organizationId);

  LocationPackageFullDto update(Long locationPackageId, Long organizationId, LocationPackageFullDto newLocationPackage);

  LocationPackageFullDto create(Long organizationId, LocationPackageFullDto newLocationPackage);
}
