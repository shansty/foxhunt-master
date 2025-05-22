package com.itechart.foxhunt.api.competition;

import com.itechart.foxhunt.api.competition.repository.CompetitionParticipantRepository;
import com.itechart.foxhunt.domain.entity.CompetitionEntity;
import com.itechart.foxhunt.domain.entity.CompetitionParticipantEntity;
import com.itechart.foxhunt.domain.entity.RoleEntity;
import com.itechart.foxhunt.domain.entity.UserEntity;
import com.itechart.foxhunt.domain.enums.Role;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
public class UserEntityUtils {
    private static CompetitionParticipantRepository competitionParticipantRepository;

    public UserEntityUtils(CompetitionParticipantRepository competitionParticipantRepository) {
        UserEntityUtils.competitionParticipantRepository = competitionParticipantRepository;
    }

    public static Long getStartPositionForCompetition(
        CompetitionEntity competition,
        UserEntity userEntity) {
        Set<CompetitionParticipantEntity> competitions = competitionParticipantRepository.getAllByUserId(userEntity.getId());
        CompetitionParticipantEntity competitionParticipant = competitions.stream()
            .filter(userCompetitions -> competition.getId().equals(userCompetitions.getCompetition().getId()))
            .findAny().orElse(CompetitionParticipantEntity.builder().startPosition(-1L).build());

        if (competitionParticipant.getStartPosition() < 0 && !isAdminOrTrainer(userEntity.getRoles())) {
            throw new IllegalArgumentException(String.format(
                "User with id = %d doesn't participate in competition with id = %d", userEntity.getId(), competition.getId()));
        }
        return competitionParticipant.getStartPosition();
    }

    private static boolean isAdminOrTrainer(Set<RoleEntity> roles) {
        boolean isAdmin = roles.stream().anyMatch(a -> a.getRole().equals(Role.ORGANIZATION_ADMIN));
        boolean isCoach = roles.stream().anyMatch(a -> a.getRole().equals(Role.TRAINER));
        return isCoach || isAdmin;
    }
}
