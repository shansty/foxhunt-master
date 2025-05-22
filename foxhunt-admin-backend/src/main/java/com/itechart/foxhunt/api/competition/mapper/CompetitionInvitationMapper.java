package com.itechart.foxhunt.api.competition.mapper;

import com.itechart.foxhunt.api.competition.dto.CompetitionInvitation;
import com.itechart.foxhunt.api.competition.entity.CompetitionInvitationEntity;
import com.itechart.foxhunt.api.user.dto.User;
import com.itechart.foxhunt.domain.entity.UserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface CompetitionInvitationMapper {

    @Mapping(target = "competitionId", source = "competition.id")
    CompetitionInvitation entityToDomain(CompetitionInvitationEntity invitationEntity);

    //used in entityToDomain
    User userEntityToUserShortDto(UserEntity userEntity);

}
