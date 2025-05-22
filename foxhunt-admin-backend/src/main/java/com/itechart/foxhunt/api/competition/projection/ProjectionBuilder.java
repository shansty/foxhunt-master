package com.itechart.foxhunt.api.competition.projection;

import com.itechart.foxhunt.api.competition.dto.Competition;
import org.springframework.data.domain.Page;

public interface ProjectionBuilder {

    Page<? extends Competition> buildCompetitionProjectionList(Page<Competition> competitions,
                                                               Long organizationId, Long userId);
}
