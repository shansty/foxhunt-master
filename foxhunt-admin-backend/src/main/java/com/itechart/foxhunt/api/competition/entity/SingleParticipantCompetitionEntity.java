package com.itechart.foxhunt.api.competition.entity;

import com.itechart.foxhunt.api.competition.dto.Competition;
import com.vladmihalcea.hibernate.type.json.JsonBinaryType;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;

import javax.persistence.*;

@Entity
@Data
@Table(name = "single_participant_competition", schema = "fh_admin")
@TypeDef(name = "jsonb", typeClass = JsonBinaryType.class)
@NoArgsConstructor
public class SingleParticipantCompetitionEntity {

    public SingleParticipantCompetitionEntity(
        Competition competition) {
        this.competition = competition;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "single_participant_competition_id")
    private Long id;

    @Type(type = "jsonb")
    @Column(columnDefinition = "jsonb")
    private Competition competition;
}
