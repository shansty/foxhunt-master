package com.itechart.foxhunt.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.MapsId;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "competition_participant", schema = "fh_admin")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompetitionParticipantEntity {

    @EmbeddedId
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private CompetitionParticipantId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("competitionId")
    @JoinColumn(name = "competition_id", referencedColumnName = "competition_id")
    private CompetitionEntity competition;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name = "user_id", referencedColumnName = "app_user_id")
    private UserEntity user;

    @Column(name = "start_position")
    private Long startPosition;

    @Column(name = "participant_number")
    private Integer participantNumber;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "finish_date")
    private LocalDateTime finishDate;

    @Column(name = "completed")
    private boolean completed;

    @OneToMany(mappedBy = "competitionParticipant", orphanRemoval = true)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<CompetitionResultEntity> competitionResult;

    @Column(name = "color")
    private String color;

}
