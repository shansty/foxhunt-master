package com.itechart.foxhunt.domain.entity;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(schema = "fh_admin", name = "org_user_active_history")
public class OrganizationUserActiveHistoryEntity {

    @Id
    @Column(name = "organization_user_active_history_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "organization_id", nullable = false)
    private Long organizationId;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "app_user_id", referencedColumnName = "app_user_id")
    private UserEntity user;

    @Column(name = "is_active", nullable = false)
    private boolean isActive;

    @Column(name = "date", nullable = false)
    private LocalDateTime date;

}
