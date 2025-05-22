package com.itechart.foxhunt.api.competition.service;

import com.itechart.foxhunt.api.competition.config.CompetitionTemplateConfig.CompetitionTemplate;
import com.itechart.foxhunt.api.competition.dto.Competition;
import com.itechart.foxhunt.api.competition.dto.CompetitionTemplateRequest;
import com.itechart.foxhunt.domain.entity.UserEntity;

import java.util.List;

public interface CompetitionTemplateService {

    List<CompetitionTemplate> getAll();

    Competition createCompetitionByTemplate(Long organizationId, UserEntity user, CompetitionTemplateRequest templateRequest);

}
