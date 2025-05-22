package com.itechart.foxhunt.api.competition.controller;

import com.itechart.foxhunt.api.auth.security.LoggedUserService;
import com.itechart.foxhunt.api.competition.config.CompetitionTemplateConfig.CompetitionTemplate;
import com.itechart.foxhunt.api.competition.dto.Competition;
import com.itechart.foxhunt.api.competition.dto.CompetitionTemplateRequest;
import com.itechart.foxhunt.api.competition.service.CompetitionTemplateService;
import com.itechart.foxhunt.api.core.ApiConstants;
import com.itechart.foxhunt.api.core.OrganizationId;
import com.itechart.foxhunt.api.feature.CheckFeature;
import com.itechart.foxhunt.domain.entity.UserEntity;
import com.itechart.foxhunt.domain.enums.FeatureType;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping(value = ApiConstants.COMPETITION_TEMPLATES, produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class CompetitionTemplateController {

    private final CompetitionTemplateService service;
    private final LoggedUserService loggedUserService;

    @GetMapping
    @Secured(value = {ApiConstants.ROLE_ORGANIZATION_ADMIN, ApiConstants.ROLE_TRAINER})
    public ResponseEntity<List<CompetitionTemplate>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @PostMapping
    @Secured(value = {ApiConstants.ROLE_ORGANIZATION_ADMIN, ApiConstants.ROLE_TRAINER})
    @CheckFeature(value = FeatureType.COMPETITION_TEMPLATE_MANAGEMENT)
    public ResponseEntity<Competition> createCompetitionByTemplate(OrganizationId organizationId,
                                                                   @Valid CompetitionTemplateRequest templateRequest) {
        UserEntity loggedUser = loggedUserService.getLoggedUserEntity();
        Competition competitionByTemplate = service.createCompetitionByTemplate(organizationId.getId(), loggedUser, templateRequest);
        return ResponseEntity.ok(competitionByTemplate);
    }
}
