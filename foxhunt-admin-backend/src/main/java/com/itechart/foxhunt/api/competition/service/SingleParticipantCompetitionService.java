package com.itechart.foxhunt.api.competition.service;

import com.itechart.foxhunt.api.competition.entity.SingleParticipantCompetitionEntity;
import com.itechart.foxhunt.api.competition.dto.Competition;
import com.itechart.foxhunt.api.competition.dto.SingleParticipantCompetition;
import com.itechart.foxhunt.api.user.dto.User;
import java.util.List;

public interface SingleParticipantCompetitionService {

    Competition create(SingleParticipantCompetition competition, User participant);

    List<Competition> getAllByUserId(Long userId);

    SingleParticipantCompetitionEntity findById(Long id);
}
