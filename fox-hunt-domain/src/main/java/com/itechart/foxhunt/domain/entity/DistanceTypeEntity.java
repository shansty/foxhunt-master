package com.itechart.foxhunt.domain.entity;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "distance_type", schema = "fh_admin")
public class DistanceTypeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "distance_type_id")
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "max_number_of_fox", nullable = false)
    private Integer maxNumberOfFox;

    @Column(name = "distance_length", nullable = false)
    private Integer distanceLength;

}
