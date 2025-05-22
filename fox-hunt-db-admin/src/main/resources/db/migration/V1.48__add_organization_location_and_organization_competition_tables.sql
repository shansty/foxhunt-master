DROP TABLE IF EXISTS fh_admin.organization_location CASCADE;
CREATE TABLE fh_admin.organization_location
(
    organization_id BIGINT REFERENCES fh_admin.organization(organization_id),
    location_id BIGINT REFERENCES fh_admin.location(id),
    PRIMARY KEY (organization_id, location_id)
);

DROP TABLE IF EXISTS fh_admin.organization_competition CASCADE;
CREATE TABLE fh_admin.organization_competition
(
    organization_id BIGINT REFERENCES fh_admin.organization(organization_id),
    competition_id BIGINT REFERENCES fh_admin.competition(id),
    PRIMARY KEY(organization_id, competition_id)
);
