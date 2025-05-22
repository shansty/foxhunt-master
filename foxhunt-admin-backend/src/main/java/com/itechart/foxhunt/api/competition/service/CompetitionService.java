package com.itechart.foxhunt.api.competition.service;

import com.itechart.foxhunt.api.competition.dto.CancelCompetitionRequest;
import com.itechart.foxhunt.api.competition.dto.Competition;
import com.itechart.foxhunt.api.competition.dto.CompetitionInvitation;
import com.itechart.foxhunt.api.competition.dto.GetAllCompetitionsRequest;
import com.itechart.foxhunt.api.competition.dto.ModifyCompetition;
import com.itechart.foxhunt.api.competition.dto.PersonalUserResult;
import com.itechart.foxhunt.api.user.dto.User;
import com.itechart.foxhunt.domain.entity.CompetitionEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CompetitionService {

    Page<? extends Competition> findAllAvailable(GetAllCompetitionsRequest competitionsRequest,
                                                 Pageable pageable, Long organizationId, User user);

    Competition getCompetitionById(Long id, Long organizationId);

    Page<PersonalUserResult> getUserResults(Long userId, Long organizationId, Pageable pageable);

    CompetitionEntity findById(final Long id, Long organizationId);

    void deleteById(Long id);

    void removeParticipantFromCompetition(Long competitionId, Long userId);

    Competition updateById(ModifyCompetition competition, Long id, Long organizationId);

    Competition cancelById(CancelCompetitionRequest cancelRequest, Long id, Long organizationId);

    Competition create(ModifyCompetition competition, Long organizationId);

    CompetitionInvitation subscribe(Long organizationId, Long competitionId, Long participantId,
                                    String invitationCreatorRole);

    CompetitionInvitation acceptInvitation(Long organizationId, Long competitionId, Long acceptedUserId,
                                           String invitationAccepterRole);

    CompetitionInvitation declineInvitation(Long competitionId, Long participantId);

    CompetitionInvitation declineInvitationPermanently(Long organizationId, Long competitionId, Long participantId);

    boolean existsByIdAndWithinOrganizationWithId(Long id, Long organizationId);

    List<CompetitionInvitation> getAllInvitationsByCompetitionId(Long competitionId, Long organizationId, User loggedUser);
}
