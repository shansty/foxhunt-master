package com.itechart.foxhunt.domain.entity;

import com.itechart.foxhunt.domain.enums.Role;
import com.vladmihalcea.hibernate.type.basic.PostgreSQLEnumType;

import javax.persistence.*;

import lombok.Data;
import lombok.experimental.Accessors;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;

import java.io.Serializable;

@Entity
@Table(name = "role", schema = "fh_admin")
@TypeDef(name = "pgsql_enum", typeClass = PostgreSQLEnumType.class)
@Data
@Accessors(chain = true)
public class RoleEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "role_id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Type(type = "pgsql_enum")
    private Role role;
}
