DROP VIEW IF EXISTS fh_admin.v_organization_location;
CREATE OR REPLACE VIEW fh_admin.v_organization_location AS
WITH virtual_location_organization as (
SELECT organization.organization_id,
location.location_id,
location.name,
location.is_global,
TRUE as is_virtual,
organization.is_system as is_updatable
FROM fh_admin.organization, fh_admin.location
	WHERE fh_admin.location.is_global = true
)
SELECT virtual_location_organization.organization_id,
virtual_location_organization.location_id,
virtual_location_organization.name,
virtual_location_organization.is_global,
organization_favorite_location.location_id IS NOT NULL as is_favorite,
virtual_location_organization. is_virtual,
virtual_location_organization.is_updatable
FROM virtual_location_organization
LEFT JOIN
fh_admin.organization_favorite_location
on fh_admin.organization_favorite_location.location_id = virtual_location_organization.location_id
AND fh_admin.organization_favorite_location.organization_id = virtual_location_organization.organization_id
UNION
SELECT organization_location.organization_id,
organization_location.location_id, location.name, location.is_global,
organization_favorite_location.location_id IS NOT NULL  as is_favorite, false as is_virtual,
TRUE as is_updatable
FROM fh_admin.organization_location INNER JOIN fh_admin.location ON
organization_location.location_id = fh_admin.location.location_id
LEFT JOIN fh_admin.organization_favorite_location ON
organization_location.location_id = organization_favorite_location.location_id AND
organization_location.organization_id = organization_favorite_location.organization_id
WHERE fh_admin.location.is_global = false;