ALTER TABLE fh_admin.organization_favorite_location
    DROP CONSTRAINT organization_favorite_location_location_id_fkey,
    ADD CONSTRAINT organization_favorite_location_location_id_fkey FOREIGN KEY (location_id) REFERENCES fh_admin.location (id) ON DELETE CASCADE;

ALTER TABLE fh_admin.organization_favorite_location
    DROP CONSTRAINT organization_favorite_location_organization_id_fkey,
    ADD CONSTRAINT organization_favorite_location_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES fh_admin.organization (organization_id) ON DELETE CASCADE;


