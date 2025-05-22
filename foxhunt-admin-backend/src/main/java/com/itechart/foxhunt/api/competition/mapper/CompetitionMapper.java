package com.itechart.foxhunt.api.competition.mapper;

import com.itechart.foxhunt.api.competition.dto.Competition;
import com.itechart.foxhunt.api.user.dto.User;
import com.itechart.foxhunt.domain.entity.CompetitionEntity;
import com.itechart.foxhunt.domain.entity.CompetitionParticipantEntity;
import com.itechart.foxhunt.domain.entity.UserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.ReportingPolicy;

import java.util.HashSet;
import java.util.Set;

@Mapper(
    componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE,
    uses = {CompetitionLocationMapper.class}
)
public interface CompetitionMapper {

    @Mapping(source = "participants", target = "participants", qualifiedByName = "participantsToUsers")
    Competition entityToDomain(CompetitionEntity competitionEntity);

    User entityToDomain(UserEntity userEntity);

    UserEntity userToUserEntity(User user);

    @Named("participantsToUsers")
    default Set<User> participantsToUsers(Set<CompetitionParticipantEntity> competitionParticipants) {
        if (competitionParticipants == null) {
            return new HashSet<>();
        }

        Set<User> users = new HashSet<>();
        competitionParticipants
            .forEach(competitionParticipantEntity -> {
                User user = entityToDomain(participantToUser(competitionParticipantEntity));
                user.setParticipantNumber(competitionParticipantEntity.getParticipantNumber());
                user.setStartPosition(competitionParticipantEntity.getStartPosition());
                user.setColor(competitionParticipantEntity.getColor());
                user.setCompleted(competitionParticipantEntity.isCompleted());
                user.setStartDate(competitionParticipantEntity.getStartDate());
                user.setFinishDate(competitionParticipantEntity.getFinishDate());
                users.add(user);
            });

        return users;
    }

    @Named("participantToUser")
    static UserEntity participantToUser(CompetitionParticipantEntity competitionParticipant) {
        if (competitionParticipant == null) {
            return null;
        }

        return competitionParticipant.getUser();
    }
}
