DROP TABLE IF EXISTS fh_admin.feature CASCADE;
CREATE TABLE fh_admin.feature
(
    feature_id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE,
    description VARCHAR(255),
    is_globally_enabled BOOLEAN NOT NULL
);

DROP TABLE IF EXISTS fh_admin.feature_organization CASCADE;
CREATE TABLE fh_admin.feature_organization
(
    feature_organization_id BIGSERIAL PRIMARY KEY,
    organization_id BIGSERIAL NOT NULL REFERENCES fh_admin.organization(organization_id),
    feature_id BIGSERIAL NOT NULL REFERENCES fh_admin.feature(feature_id),
    is_enabled BOOLEAN NOT NULL
);

INSERT INTO fh_admin.feature(name, description, is_globally_enabled)
VALUES ('LOCATION_MANAGEMENT', 'Access to create, update and delete pages/actions for locations and appropriate backend endpoints', true) ;
INSERT INTO fh_admin.feature(name, description, is_globally_enabled)
VALUES ('YANDEX_MAPS', 'Yandex maps widget that is displayed on all the pages', true) ;

INSERT INTO fh_admin.feature_organization (feature_id, organization_id, is_enabled)
VALUES ((SELECT feature_id FROM fh_admin.feature WHERE name='LOCATION_MANAGEMENT'), 1, true);
INSERT INTO fh_admin.feature_organization (feature_id, organization_id, is_enabled)
VALUES ((SELECT feature_id FROM fh_admin.feature WHERE name='YANDEX_MAPS'), 1, true);