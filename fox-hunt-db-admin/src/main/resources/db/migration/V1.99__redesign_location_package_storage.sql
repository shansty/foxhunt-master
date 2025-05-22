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
       location_package.access_type = 'PRIVATE'::fh_admin.location_package_type OR fh_admin.organization.is_system as is_updatable
FROM fh_admin.organization_location_package
INNER JOIN fh_admin.location_package ON
organization_location_package.location_package_id = fh_admin.location_package.location_package_id
INNER JOIN fh_admin.organization ON
organization_location_package.organization_id = fh_admin.organization.organization_id
WHERE fh_admin.location_package.access_type IN ('SHARED', 'PRIVATE')