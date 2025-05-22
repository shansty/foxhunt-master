CREATE SCHEMA IF NOT EXISTS LOCATION;


CREATE TYPE location.location_package_type AS ENUM ('SYSTEM', 'SHARED', 'PRIVATE');


ALTER TABLE fh_admin.location
    SET SCHEMA LOCATION;

ALTER TABLE fh_admin.location_package
    SET SCHEMA LOCATION;

ALTER TABLE fh_admin.location_package_location
    SET SCHEMA LOCATION;

ALTER TABLE fh_admin.organization_favorite_location
    SET SCHEMA LOCATION;

ALTER TABLE fh_admin.organization_location
    SET SCHEMA LOCATION;

ALTER TABLE fh_admin.organization_location_package
    SET SCHEMA LOCATION;



ALTER TABLE location.location
    RENAME TO locations;

ALTER TABLE location.location_package
    RENAME TO location_packages;

ALTER TABLE location.location_package_location
    RENAME TO location_package_locations;

ALTER TABLE location.organization_favorite_location
    RENAME TO organization_favorite_locations;

ALTER TABLE location.organization_location
    RENAME TO organization_locations;

ALTER TABLE location.organization_location_package
    RENAME TO organization_location_packages;


DROP VIEW IF EXISTS location.v_organizations;

/* 4 is ID for system organization. We have only one system organization */
CREATE OR REPLACE VIEW location.v_organizations AS
SELECT DISTINCT location.organization_location_packages.organization_id,
                FALSE AS is_system
FROM location.organization_location_packages
WHERE location.organization_location_packages.organization_id != 4
UNION
SELECT DISTINCT location.organization_locations.organization_id,
                FALSE AS is_system
FROM location.organization_locations
WHERE location.organization_locations.organization_id != 4
UNION
SELECT 4 AS organization_id,
       TRUE AS is_system;


DROP VIEW IF EXISTS fh_admin.v_organization_location;


DROP VIEW IF EXISTS location.v_organization_locations;


CREATE OR REPLACE VIEW location.v_organization_locations AS WITH virtual_location_organization AS
                                                                     (SELECT v_organizations.organization_id,
                                                                             locations.location_id,
                                                                             locations.name,
                                                                             locations.is_global,
                                                                             TRUE AS is_virtual,
                                                                             v_organizations.is_system AS is_updatable
                                                                      FROM location.v_organizations,
                                                                           location.locations
                                                                      WHERE location.locations.is_global = TRUE )
                                                            SELECT virtual_location_organization.organization_id,
                                                                   virtual_location_organization.location_id,
                                                                   virtual_location_organization.name,
                                                                   virtual_location_organization.is_global,
                                                                   organization_favorite_locations.location_id IS NOT NULL AS is_favorite,
                                                                   virtual_location_organization. is_virtual,
                                                                   virtual_location_organization.is_updatable
                                                            FROM virtual_location_organization
                                                                     LEFT JOIN location.organization_favorite_locations ON location.organization_favorite_locations.location_id = virtual_location_organization.location_id
                                                                AND location.organization_favorite_locations.organization_id = virtual_location_organization.organization_id
                                                            UNION
                                                            SELECT organization_locations.organization_id,
                                                                   organization_locations.location_id,
                                                                   locations.name,
                                                                   locations.is_global,
                                                                   organization_favorite_locations.location_id IS NOT NULL AS is_favorite,
                                                                   FALSE AS is_virtual,
                                                                   TRUE AS is_updatable
                                                            FROM location.organization_locations
                                                                     INNER JOIN location.locations ON organization_locations.location_id = location.locations.location_id
                                                                     LEFT JOIN location.organization_favorite_locations ON organization_locations.location_id = organization_favorite_locations.location_id
                                                                AND organization_locations.organization_id = organization_favorite_locations.organization_id
                                                            WHERE location.locations.is_global = FALSE;

DROP VIEW IF EXISTS fh_admin.v_organization_location_package;


DROP VIEW IF EXISTS location.v_organization_location_packages;


CREATE OR REPLACE VIEW location.v_organization_location_packages AS
SELECT v_organizations.organization_id,
       location_packages.location_package_id,
       location_packages.name,
       location_packages.assignment_type,
       location_packages.access_type,
       v_organizations.is_system AS is_updatable
FROM location.v_organizations,
     location.location_packages
WHERE location.location_packages.access_type = 'SYSTEM'
UNION
SELECT v_organizations.organization_id,
       location_packages.location_package_id,
       location_packages.name,
       location_packages.assignment_type,
       location_packages.access_type,
       location_packages.access_type = 'PRIVATE'
           OR location.v_organizations.is_system AS is_updatable
FROM location.organization_location_packages
         INNER JOIN location.location_packages ON organization_location_packages.location_package_id = location.location_packages.location_package_id
         INNER JOIN location.v_organizations ON organization_location_packages.organization_id = location.v_organizations.organization_id
WHERE location.location_packages.access_type IN ('SHARED',
                                                 'PRIVATE');