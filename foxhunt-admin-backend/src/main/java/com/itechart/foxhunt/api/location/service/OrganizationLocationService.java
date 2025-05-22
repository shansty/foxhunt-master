package com.itechart.foxhunt.api.location.service;

import com.itechart.foxhunt.api.location.dto.CloneLocationRequest;
import com.itechart.foxhunt.api.location.dto.LocationFullDto;
import com.itechart.foxhunt.api.user.dto.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface OrganizationLocationService {

    Page<LocationFullDto> getAll(Long organizationId, Pageable pageable);

    List<LocationFullDto> getAllFavorite(Long organizationId, Pageable pageable);

    LocationFullDto create(Long organizationId, LocationFullDto newLocation, User createdBy);

    LocationFullDto clone(Long organizationId, Long locationId, User clonedBy, CloneLocationRequest cloneRequest);

    LocationFullDto update(Long locationId, Long organizationId, LocationFullDto newLocation);

    void delete(Long locationId, Long organizationId);

    LocationFullDto findByIdAndOrganizationId(Long locationId, Long organizationId);

    Page<LocationFullDto> getAllByLocationName(Long organizationId, Pageable pageable, String name);

    void toggleFavorite(Long locationId, Long organizationId);

}
