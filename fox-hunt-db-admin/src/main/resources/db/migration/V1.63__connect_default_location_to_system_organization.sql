INSERT INTO fh_admin.organization_location (organization_id, location_id)
SELECT o.id, l.id FROM (SELECT organization_id AS id FROM fh_admin.organization WHERE is_system = TRUE) o,
(SELECT location_id AS id FROM fh_admin.location WHERE is_global = TRUE) l;