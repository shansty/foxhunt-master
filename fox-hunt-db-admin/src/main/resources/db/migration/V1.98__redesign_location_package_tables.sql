DROP TABLE IF EXISTS fh_admin.organization_location_package CASCADE;
CREATE TABLE fh_admin.organization_location_package
(
    organization_id BIGSERIAL NOT NULL,
    location_package_id BIGSERIAL NOT NULL,
    PRIMARY KEY (organization_id, location_package_id),
    CONSTRAINT organization_location_package_lp FOREIGN KEY (location_package_id) REFERENCES fh_admin.location_package (location_package_id),
    CONSTRAINT organization_location_package_o FOREIGN KEY (organization_id) REFERENCES fh_admin.organization (organization_id)
);

INSERT INTO fh_admin.organization_location_package SELECT organization_id, location_package_id FROM fh_admin.location_package WHERE type = 'PRIVATE';

ALTER TABLE fh_admin.location_package DROP COLUMN organization_id;

ALTER TABLE fh_admin.location_package RENAME COLUMN type TO access_type;
ALTER TABLE fh_admin.location_package RENAME COLUMN creation_type TO assignment_type;