package com.itechart.foxhunt.domain.entity;

import com.itechart.foxhunt.domain.enums.CompetitionStatus;
import com.vladmihalcea.hibernate.type.basic.PostgreSQLEnumType;
import com.vladmihalcea.hibernate.type.json.JsonBinaryType;
import com.vladmihalcea.hibernate.type.json.JsonStringType;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;
import org.hibernate.annotations.TypeDefs;
import org.hibernate.annotations.UpdateTimestamp;
import org.locationtech.jts.geom.Point;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
@Entity
@Table(name = "competition", schema = "fh_admin")
@TypeDefs({
                @TypeDef(name = "pgsql_enum", typeClass = PostgreSQLEnumType.class),
                @TypeDef(name = "json", typeClass = JsonStringType.class),
                @TypeDef(name = "jsonb", typeClass = JsonBinaryType.class)
})
@NoArgsConstructor
public class CompetitionEntity {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "competition_id")
        private Long id;

        @Column(name = "name", nullable = false, unique = true)
        private String name;

        @Column(name = "notes", nullable = true, unique = false)
        private String notes;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "coach_id", referencedColumnName = "app_user_id", nullable = false)
        private UserEntity coach;

        @Column(name = "fox_amount", nullable = true)
        private Byte foxAmount;

        @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
        @JoinColumn(name = "competition_id")
        private List<FoxPointEntity> foxPoints = new ArrayList<>();

        @Column(name = "closing_active_fox", nullable = true)
        private Integer closingActiveFox;

        @Column(name = "start_point", nullable = false, columnDefinition = "geometry(Point,6708)")
        private Point startPoint;

        @Column(name = "finish_point", nullable = false, columnDefinition = "geometry(Point,6708)")
        private Point finishPoint;

        @Column(name = "start_date", nullable = false)
        private LocalDateTime startDate;

        @CreationTimestamp
        @Column(name = "created_date", nullable = false)
        private LocalDateTime createdDate;

        @UpdateTimestamp
        @Column(name = "updated_date", nullable = false)
        private LocalDateTime updatedDate;

        @Type(type = "jsonb")
        @Column(name = "location", columnDefinition = "jsonb")
        @EqualsAndHashCode.Exclude
        @ToString.Exclude
        private CompetitionLocation location;

        @ManyToOne
        @JoinColumn(name = "distance_type", referencedColumnName = "distance_type_id", nullable = true)
        private DistanceTypeEntity distanceType;

        @Column(name = "status", nullable = false)
        @Enumerated(EnumType.STRING)
        @Type(type = "pgsql_enum")
        private CompetitionStatus status;

        @Column(name = "organization_id", nullable = false)
        private Long organizationId;

        // Time each fox is active (and the time of silence period) in seconds.
        @Column(name = "fox_duration", nullable = true)
        private Integer foxDuration;

        @Column(name = "fox_range", nullable = false)
        private Integer foxRange;

        @Column(name = "expected_competition_duration", nullable = true)
        private String expectedCompetitionDuration;

        @Column(name = "has_silence_interval", nullable = true)
        private boolean hasSilenceInterval;

        @OneToMany(mappedBy = "competition", cascade = CascadeType.ALL, orphanRemoval = true)
        @EqualsAndHashCode.Exclude
        @ToString.Exclude
        private Set<CompetitionParticipantEntity> participants = new HashSet<>();

        @Column(name = "actual_start_date", nullable = true)
        private LocalDateTime actualStartDate;

        @Column(name = "actual_finish_date", nullable = true)
        private LocalDateTime actualFinishDate;

        @Column(name = "stopping_reason", nullable = true)
        private String stoppingReason;

        @Column(name = "cancellation_reason")
        private String cancellationReason;

        @Column(name = "frequency", nullable = true, precision = 10, scale = 2)
        private BigDecimal frequency;

        @Column(name = "is_private")
        private Boolean isPrivate;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "created_by", referencedColumnName = "app_user_id", nullable = false, updatable = false)
        private UserEntity createdBy;

        @Column(name = "is_emulated", nullable = false)
        private Boolean isEmulated = false;

        public CompetitionEntity(Long id) {
                this.id = id;
        }

        public void setFoxPointList(List<FoxPointEntity> foxPoints) {
                this.foxPoints.clear();
                this.foxPoints.addAll(foxPoints);
        }

}
