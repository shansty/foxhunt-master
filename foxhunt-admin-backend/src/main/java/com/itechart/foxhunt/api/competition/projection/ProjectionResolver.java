package com.itechart.foxhunt.api.competition.projection;

import com.itechart.foxhunt.api.competition.dto.Competition;
import com.itechart.foxhunt.api.competition.dto.CompetitionWithInvitationInfo;
import com.itechart.foxhunt.api.competition.dto.GetAllCompetitionsRequest;
import com.itechart.foxhunt.api.competition.mapper.CompetitionMapper;
import com.itechart.foxhunt.api.competition.repository.CompetitionRepository;
import com.itechart.foxhunt.api.competition.service.WithInvitationInfoBuilder;
import com.itechart.foxhunt.domain.entity.CompetitionEntity;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@Slf4j
public class ProjectionResolver {

    private final Map<String, ProjectionBuilder> competitionProjectionBuildersMap;

    private final CompetitionRepository competitionRepository;

    private final CompetitionMapper competitionMapper;

    public ProjectionResolver(WithInvitationInfoBuilder withInvitationInfoBuilder,
                              CompetitionRepository competitionRepository,
                              CompetitionMapper competitionMapper) {
        this.competitionProjectionBuildersMap = Map
            .of(CompetitionWithInvitationInfo.class.getSimpleName(), withInvitationInfoBuilder);
        this.competitionRepository = competitionRepository;
        this.competitionMapper = competitionMapper;
    }

    public Page<? extends Competition> getCompetitionProjectionsList(Long userId, GetAllCompetitionsRequest request,
                                                                     Pageable pageable, Long organizationId) {
        Page<CompetitionEntity> competitionsPage = isSearchRequired(request) ?
            competitionRepository.findAllFiltered(organizationId, request, pageable) :
            competitionRepository.findAllByOrganizationId(organizationId, pageable);

        String projection = request.getProjection();
        if (projection == null || !competitionProjectionBuildersMap.containsKey(projection)) {
            log.warn("Projection is null or builder not found. Returning default representation");
            return competitionsPage.map(competitionMapper::entityToDomain);
        } else {
            ProjectionBuilder projectionBuilder = competitionProjectionBuildersMap.get(projection);
            return projectionBuilder
                .buildCompetitionProjectionList(competitionsPage.map(competitionMapper::entityToDomain), organizationId, userId);
        }
    }

    private boolean isSearchRequired(GetAllCompetitionsRequest competitionsRequest) {
        return !competitionsRequest.getStatuses().isEmpty() ||
            !competitionsRequest.getName().isEmpty() ||
            competitionsRequest.getStartDate().getDay() != null ||
            competitionsRequest.getStartDate().getMonth() != null ||
            competitionsRequest.getStartDate().getYear() != null;
    }
}
