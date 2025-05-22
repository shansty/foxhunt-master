package com.itechart.foxhunt.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "competition_result", schema = "fh_admin")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompetitionResultEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "competition_result_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fox_point_id",
            referencedColumnName = "fox_point_id",
            nullable = false)
    private FoxPointEntity foxPoint;

    @Column(name = "visit_date", nullable = false)
    private LocalDateTime visitDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumns({
        @JoinColumn(name = "competition_id", referencedColumnName = "competition_id"),
        @JoinColumn(name = "user_id" , referencedColumnName = "user_id")
    })
    private CompetitionParticipantEntity competitionParticipant;

}
