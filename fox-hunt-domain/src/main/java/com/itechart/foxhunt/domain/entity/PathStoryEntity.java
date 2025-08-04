package com.itechart.foxhunt.domain.entity;

import org.locationtech.jts.geom.Point;
import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "path_story", schema = "fh_admin")
@SecondaryTable(name = "path_story_ranked", schema = "fh_admin")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PathStoryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "path_story_id")
    private Long id;

    @Column(name = "game_time", nullable = false)
    private LocalDateTime gameTime;

    @Column(name = "current_place", nullable = false)
    private Point currentPlace;

    @Column(name = "time_to_fox_change", nullable = false)
    private Long timeToFoxChange;

    @ManyToOne
    @JoinColumn(name = "active_fox_id", referencedColumnName = "fox_point_id", nullable = true)
    private FoxPointEntity activeFox;

    @Column(name = "is_disconnected", nullable = false)
    private Boolean isDisconnected = false;

    /**
     * field from view path_story_ranked which extend base table with postgres
     * function rank()
     */
    @Column(name = "rank", table = "path_story_ranked", insertable = false, updatable = false)
    private Long rank;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "listenable_fox_id", referencedColumnName = "fox_point_id")
    private FoxPointEntity listenableFox;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_tracker_id", referencedColumnName = "location_tracker_id")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private LocationTrackerEntity locationTrackerEntity;
}
