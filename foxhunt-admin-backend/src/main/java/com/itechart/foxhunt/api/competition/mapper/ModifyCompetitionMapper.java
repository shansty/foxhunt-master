package com.itechart.foxhunt.api.competition.mapper;

import com.itechart.foxhunt.api.competition.dto.Competition;
import com.itechart.foxhunt.api.competition.dto.ModifyCompetition;
import com.itechart.foxhunt.domain.entity.CompetitionEntity;
import com.itechart.foxhunt.domain.entity.CompetitionParticipantEntity;
import com.itechart.foxhunt.domain.entity.UserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.ReportingPolicy;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(
    componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE,
    uses = {CompetitionLocationMapper.class}
)
public interface ModifyCompetitionMapper {

    @Mapping(source = "coachId", target = "coach", qualifiedByName = "idToEntity")
    CompetitionEntity domainToEntity(ModifyCompetition competition);

    @Mapping(source = "coach", target = "coachId", qualifiedByName = "entityToId")
    @Mapping(source = "participants", target = "participantsId", qualifiedByName = "entitiesToIds")
    ModifyCompetition entityToDomain(CompetitionEntity competitionEntity);

    ModifyCompetition convertToDomain(Competition competition);

    @Named("idToEntity")
    static UserEntity idToEntity(Long id) {
        if (id == null) {
            return null;
        }
        final UserEntity entity = new UserEntity();
        entity.setId(id);
        return entity;
    }

    @Named("entityToId")
    static Long entityToId(UserEntity entity) {
        if (entity == null) {
            return null;
        }
        return entity.getId();
    }

    @Named("entitiesToIds")
    static Set<Long> entitiesToIds(Set<CompetitionParticipantEntity> entities) {
        if (entities == null) {
            return new HashSet<>();
        }
        return entities.stream().map(ModifyCompetitionMapper::participantToId).collect(Collectors.toSet());
    }

    @Named("participantToId")
    static Long participantToId(CompetitionParticipantEntity competitionParticipant) {
        if (competitionParticipant == null) {
            return null;
        }
        return competitionParticipant.getUser().getId();
    }
}
