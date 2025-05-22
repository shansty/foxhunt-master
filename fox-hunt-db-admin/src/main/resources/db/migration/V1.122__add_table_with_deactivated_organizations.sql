DROP TABLE IF EXISTS fh_admin.deactivated_organizations CASCADE;
CREATE TABLE fh_admin.deactivated_organizations
(
    id BIGSERIAL PRIMARY KEY,
    organization_id BIGINT UNIQUE REFERENCES fh_admin.organization(organization_id),
    created_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS organization_id_idx ON fh_admin.deactivated_organizations (organization_id);