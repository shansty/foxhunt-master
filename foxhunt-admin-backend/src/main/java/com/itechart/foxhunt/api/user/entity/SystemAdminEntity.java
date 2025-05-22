package com.itechart.foxhunt.api.user.entity;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "system_admin", schema = "fh_admin")
public class SystemAdminEntity {

    @Id
    @Column(name = "system_admin_id")
    private Long id;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

}
