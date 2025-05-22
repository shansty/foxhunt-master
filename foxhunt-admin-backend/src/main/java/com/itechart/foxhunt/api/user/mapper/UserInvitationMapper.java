package com.itechart.foxhunt.api.user.mapper;

import com.itechart.foxhunt.api.organization.Organization;
import com.itechart.foxhunt.api.organization.OrganizationShortDto;
import com.itechart.foxhunt.api.user.dto.InvitationDeclineReason;
import com.itechart.foxhunt.api.user.dto.UserInvitation;
import com.itechart.foxhunt.api.user.dto.UserInvitationShortDto;
import com.itechart.foxhunt.domain.entity.UserInvitationEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

@Mapper(
    unmappedTargetPolicy = ReportingPolicy.IGNORE, unmappedSourcePolicy = ReportingPolicy.IGNORE,
    uses = {UserMapper.class}
)
public interface UserInvitationMapper {

    InvitationDeclineReason entityToDeclineReason(UserInvitationEntity userInvitationEntity);

    @Mapping(target = "organization", source = "organization")
    @Mapping(target = "user", source = "userInvitationEntity.userEntity")
    @Mapping(target = "status", source = "userInvitationEntity.status")
    UserInvitation entityToDomain(UserInvitationEntity userInvitationEntity, Organization organization);

    @Mapping(target = "organization.id", source = "organizationId")
    @Mapping(target = "user", source = "userEntity")
    UserInvitation entityToDomain(UserInvitationEntity userInvitationEntity);

    UserInvitation updateChangedFields(@MappingTarget UserInvitation userInvitation, UserInvitationEntity userInvitationEntity);

    UserInvitationShortDto convertToShortDto(UserInvitation userInvitation);

    OrganizationShortDto organizationToOrganizationShortDto(Organization organization);

    @Mapping(target = "organizationId", source = "organization.id")
    @Mapping(target = "userEntity", source = "user")
    UserInvitationEntity domainToEntity(UserInvitation userInvitation);

}
