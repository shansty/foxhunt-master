package com.itechart.foxhunt.api.competition.dto;

import com.itechart.foxhunt.domain.entity.FoxPointEntity;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ActiveFoxInfo {

    private FoxPointEntity foxPoint;
    private int foxPointIndex;

    private final long timeToChangeActiveFox;
}
