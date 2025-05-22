ALTER TABLE fh_admin.feature_organization
    ADD UNIQUE (feature_id, organization_id);

INSERT INTO fh_admin.feature (name, description, is_globally_enabled)
VALUES ('FAVORITE_LOCATION_MANAGEMENT',
        'Access to adding favorite locations to the organization and displaying them in the navbar',
        true);