DROP TYPE IF EXISTS fh_admin.location_package_creation_type CASCADE;
CREATE TYPE fh_admin.location_package_creation_type AS ENUM (
	'AREA_BASED', 'LIST_BASED'
);

ALTER TABLE fh_admin.location_package ADD COLUMN creation_type fh_admin.location_package_creation_type;

UPDATE fh_admin.location_package SET creation_type = 'LIST_BASED' WHERE name = 'Zelyonoe';

ALTER TABLE fh_admin.location_package ALTER COLUMN creation_type SET NOT NULL;

ALTER TABLE fh_admin.location_package ALTER COLUMN coordinates DROP NOT NULL;

