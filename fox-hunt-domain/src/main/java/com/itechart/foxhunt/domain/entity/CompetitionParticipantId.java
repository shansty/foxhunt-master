package com.itechart.foxhunt.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.io.Serializable;

@Data
@Embeddable
@AllArgsConstructor
@NoArgsConstructor
public class CompetitionParticipantId implements Serializable {

    private static final long serialVersionUID = 1L;

    @Column(name = "competition_id")
    private Long competitionId;

    @Column(name = "user_id")
    private Long userId;
}
