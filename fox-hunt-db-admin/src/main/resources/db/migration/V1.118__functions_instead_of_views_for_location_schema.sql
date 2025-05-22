DROP VIEW IF EXISTS location.v_organization_locations;

DROP VIEW IF EXISTS location.v_organization_location_packages;

DROP VIEW IF EXISTS location.v_organizations;


DROP FUNCTION IF EXISTS location.f_global_locations;

CREATE OR REPLACE FUNCTION LOCATION.f_global_locations(_organization_id_ bigint, _system_organization_id_ bigint)
    RETURNS TABLE
        (organization_id bigint,
        location_id bigint,
        name varchar(40),
        is_global boolean,
        is_favorite boolean,
        is_virtual boolean,
        is_updatable boolean)
    LANGUAGE PLPGSQL AS $func$
BEGIN RETURN QUERY
    SELECT _organization_id_ AS organization_id,
           l.location_id,
           l.name,
           l.is_global,
           fl.location_id IS NOT NULL AS is_favorite,
           _organization_id_ != _system_organization_id_ AS is_virtual,
           TRUE AS is_updatable
    FROM location.organization_locations ol
             INNER JOIN location.locations l ON l.location_id = ol.location_id
             LEFT JOIN location.organization_favorite_locations fl ON fl.location_id = l.location_id
        AND fl.organization_id = _organization_id_
    WHERE l.is_global = TRUE
      AND ol.organization_id = _system_organization_id_;
END
$func$;


DROP FUNCTION IF EXISTS location.f_organization_locations;

CREATE OR REPLACE FUNCTION LOCATION.f_organization_locations(_organization_id_ bigint)
    RETURNS TABLE
        (organization_id bigint,
        location_id bigint,
        name varchar(40),
        is_global boolean,
        is_favorite boolean,
        is_virtual boolean,
        is_updatable boolean)
    LANGUAGE PLPGSQL AS $func$
BEGIN RETURN QUERY
    SELECT _organization_id_ AS organization_id,
           ol.location_id,
           l.name,
           l.is_global,
           ofl.location_id IS NOT NULL AS is_favorite,
           FALSE AS is_virtual,
           TRUE AS is_updatable
    FROM location.organization_locations ol
             INNER JOIN location.locations l ON ol.location_id = l.location_id
             LEFT JOIN location.organization_favorite_locations ofl ON ol.location_id = ofl.location_id
        AND ol.organization_id = ofl.organization_id
    WHERE l.is_global = FALSE
      AND ol.organization_id = _organization_id_;
END
$func$;


DROP FUNCTION IF EXISTS location.f_available_locations;

CREATE OR REPLACE FUNCTION LOCATION.f_available_locations(_organization_id_ bigint, _system_organization_id_ bigint)
    RETURNS TABLE
        (organization_id bigint,
        location_id bigint,
        name varchar(40),
        is_global boolean,
        is_favorite boolean,
        is_virtual boolean,
        is_updatable boolean)
    LANGUAGE PLPGSQL AS $func$
BEGIN RETURN QUERY
    SELECT * FROM location.f_organization_locations(_organization_id_)
    UNION
    SELECT * FROM location.f_global_locations(_organization_id_, _system_organization_id_);
END
$func$;


DROP FUNCTION IF EXISTS location.f_global_packages;

CREATE OR REPLACE FUNCTION LOCATION.f_global_packages(_organization_id_ bigint, _system_organization_id_ bigint)
    RETURNS TABLE
        (organization_id bigint,
        location_package_id bigint,
        name varchar(40),
        assignment_type varchar(40),
        access_type varchar(10),
        is_updatable boolean)
    LANGUAGE PLPGSQL AS $func$
BEGIN RETURN QUERY
    SELECT _organization_id_ AS organization_id,
           lp.location_package_id,
           lp.name,
           lp.assignment_type,
           lp.access_type,
           _organization_id_ = _system_organization_id_ AS is_updatable
    FROM location.location_packages lp
    WHERE lp.access_type = 'SYSTEM';
END
$func$;


DROP FUNCTION IF EXISTS location.f_organization_packages;

CREATE OR REPLACE FUNCTION LOCATION.f_organization_packages(_organization_id_ bigint, _system_organization_id_ bigint)
    RETURNS TABLE
        (organization_id bigint,
        location_package_id bigint,
        name varchar(40),
        assignment_type varchar(40),
        access_type varchar(10),
        is_updatable boolean)
    LANGUAGE PLPGSQL AS $func$
BEGIN RETURN QUERY
    SELECT olp.organization_id,
           lp.location_package_id,
           lp.name,
           lp.assignment_type,
           lp.access_type,
           lp.access_type = 'PRIVATE'
               OR _organization_id_ = _system_organization_id_ AS is_updatable
    FROM location.organization_location_packages olp
             INNER JOIN location.location_packages lp ON olp.location_package_id = lp.location_package_id
    WHERE lp.access_type IN ('SHARED', 'PRIVATE') AND olp.organization_id = _organization_id_;
END
$func$;

DROP FUNCTION IF EXISTS location.f_available_packages;

CREATE OR REPLACE FUNCTION LOCATION.f_available_packages(_organization_id_ bigint, _system_organization_id_ bigint)
    RETURNS TABLE
        (organization_id bigint,
        location_package_id bigint,
        name varchar(40),
        assignment_type varchar(40),
        access_type varchar(10),
        is_updatable boolean)
    LANGUAGE PLPGSQL AS $func$
BEGIN RETURN QUERY
    SELECT * FROM location.f_global_packages(_organization_id_, _system_organization_id_)
    UNION
    SELECT * FROM location.f_organization_packages(_organization_id_, _system_organization_id_);
END
$func$;