package com.itechart.foxhunt.api.competition.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import com.itechart.foxhunt.api.competition.CompetitionInvitationStatus;
import com.itechart.foxhunt.api.core.ApiConstants;
import com.itechart.foxhunt.api.user.dto.User;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CompetitionInvitation {

    private Long id;

    private Long competitionId;

    private User participant;

    private CompetitionInvitationStatus status;

    private String source;

    @JsonFormat(pattern = ApiConstants.TIMESTAMP_WITHOUT_TIMEZONE)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    private LocalDateTime createdAt;

    @JsonFormat(pattern = ApiConstants.TIMESTAMP_WITHOUT_TIMEZONE)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    private LocalDateTime updatedAt;

}
