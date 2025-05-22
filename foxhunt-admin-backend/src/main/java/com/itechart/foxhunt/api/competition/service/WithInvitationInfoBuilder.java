package com.itechart.foxhunt.api.competition.service;

import com.itechart.foxhunt.api.competition.CompetitionInvitationStatus;
import com.itechart.foxhunt.api.competition.dto.Competition;
import com.itechart.foxhunt.api.competition.dto.CompetitionWithInvitationInfo;
import com.itechart.foxhunt.api.competition.entity.CompetitionInvitationEntity;
import com.itechart.foxhunt.api.competition.projection.ProjectionBuilder;
import com.itechart.foxhunt.api.competition.repository.CompetitionInvitationRepository;
import com.itechart.foxhunt.api.competition.repository.CompetitionParticipantRepository;
import com.itechart.foxhunt.api.core.ApiConstants;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class WithInvitationInfoBuilder implements ProjectionBuilder {

    private final CompetitionInvitationRepository competitionInvitationRepository;

    private final CompetitionParticipantRepository competitionParticipantRepository;

    @Override
    public Page<CompetitionWithInvitationInfo> buildCompetitionProjectionList(
        Page<Competition> competitions,
        Long organizationId, Long userId) {
        List<CompetitionWithInvitationInfo> competitionWithInvitationInfoList = competitions.stream().map(competition -> {
            Optional<CompetitionInvitationEntity> invitation = competitionInvitationRepository
                .findByCompetitionIdAndParticipantId(competition.getId(), userId);

            boolean joinedPublicCompetition = competitionParticipantRepository
                .existsByCompetitionIdAndUserId(competition.getId(), userId);

            if (joinedPublicCompetition) {
                return new CompetitionWithInvitationInfo(
                    CompetitionInvitationStatus.ACCEPTED,
                    ApiConstants.SOURCE_PARTICIPANT,
                    competition);
            }

            return invitation
                .map(invitationEntity -> new CompetitionWithInvitationInfo(
                    invitationEntity.getStatus(),
                    invitationEntity.getSource(),
                    competition))
                .orElseGet(() -> new CompetitionWithInvitationInfo(competition));
        }).collect(Collectors.toList());
        return new PageImpl<>(competitionWithInvitationInfoList, competitions.getPageable(), competitions.getTotalElements());
    }
}
