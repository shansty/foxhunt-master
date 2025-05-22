package com.itechart.foxhunt.api.competition.dto;

import com.itechart.foxhunt.api.user.dto.UserResult;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CompetitionResult {

    private Long competitionId;
    private List<UserResult> userResultList;
}
