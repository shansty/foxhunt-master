ALTER TABLE fh_admin.competition
    DROP CONSTRAINT competition_name_key;

ALTER TABLE fh_admin.competition
    ADD COLUMN organization_id integer;

ALTER TABLE fh_admin.competition
    ADD CONSTRAINT fk_organization
        FOREIGN KEY (organization_id)
            REFERENCES fh_admin.organization (organization_id);

ALTER TABLE fh_admin.competition
    ADD UNIQUE (name, organization_id);

DROP TABLE fh_admin.organization_competition;

