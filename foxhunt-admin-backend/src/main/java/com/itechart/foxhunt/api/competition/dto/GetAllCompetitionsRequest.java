package com.itechart.foxhunt.api.competition.dto;

import com.itechart.foxhunt.domain.enums.CompetitionStatus;
import lombok.Data;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;

@Data
public class GetAllCompetitionsRequest {

    private List<CompetitionStatus> statuses = new ArrayList<>();
    private String projection;
    private String name = "";
    @Valid
    private DateInfo startDate = new DateInfo();

}
