package com.itechart.foxhunt.api.competition.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PersonalUserResult {
    private Competition competition;
    private int foundedFoxes;
    private LocalDateTime startDate;
    private LocalDateTime finishDate;

}
