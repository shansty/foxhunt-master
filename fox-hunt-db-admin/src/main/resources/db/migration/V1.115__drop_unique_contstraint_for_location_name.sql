ALTER TABLE fh_admin.location
    DROP CONSTRAINT location_name_key;

ALTER TABLE fh_admin.organization_location
    ADD UNIQUE (organization_id, location_id);