DROP TABLE IF EXISTS fh_admin.organization_favorite_location CASCADE;
CREATE TABLE fh_admin.organization_favorite_location
(
    organization_id BIGINT REFERENCES fh_admin.organization(organization_id),
    location_id BIGINT REFERENCES fh_admin.location(id),
    PRIMARY KEY (organization_id, location_id)
);

ALTER TABLE fh_admin.competition_participant ALTER COLUMN start_position TYPE BIGINT;
