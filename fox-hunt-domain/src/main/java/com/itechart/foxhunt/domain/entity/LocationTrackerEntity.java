package com.itechart.foxhunt.domain.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.util.List;

@Data
@Entity
@Table(name = "location_tracker", schema = "fh_admin")
public class LocationTrackerEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "location_tracker_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "participant_id",
            referencedColumnName = "app_user_id",
            nullable = false)
    private UserEntity participant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "competition_id",
            referencedColumnName = "competition_id",
            nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private CompetitionEntity competition;

    @OneToMany(
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            mappedBy = "locationTrackerEntity"
    )
    private List<PathStoryEntity> path;
}
