DROP VIEW IF EXISTS fh_admin.v_organization_location_package;

alter table fh_admin.location_package alter column access_type TYPE varchar(10);
alter table fh_admin.location_package alter column assignment_type TYPE varchar(10);

CREATE OR REPLACE VIEW fh_admin.v_organization_location_package AS
SELECT organization.organization_id,
location_package.location_package_id,
location_package.name,
location_package.assignment_type,
location_package.access_type,
organization.is_system as is_updatable
FROM  fh_admin.organization, fh_admin.location_package
WHERE fh_admin.location_package.access_type = 'SYSTEM'
UNION
SELECT organization.organization_id,
       location_package.location_package_id,
       location_package.name,
       location_package.assignment_type,
       location_package.access_type,
       location_package.access_type = 'PRIVATE' OR fh_admin.organization.is_system as is_updatable
FROM fh_admin.organization_location_package
INNER JOIN fh_admin.location_package ON
organization_location_package.location_package_id = fh_admin.location_package.location_package_id
INNER JOIN fh_admin.organization ON
organization_location_package.organization_id = fh_admin.organization.organization_id
WHERE fh_admin.location_package.access_type IN ('SHARED', 'PRIVATE');

ALTER TABLE fh_admin.location_package ALTER COLUMN access_type SET DEFAULT 'PRIVATE';

DROP TYPE fh_admin.location_package_assignment_type;
DROP TYPE fh_admin.location_package_access_type;