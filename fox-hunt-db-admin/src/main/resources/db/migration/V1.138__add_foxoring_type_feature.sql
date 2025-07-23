INSERT INTO fh_admin.feature (name, description, is_globally_enabled, display_name)
VALUES (
    'FOXORING_COMPETITION_TYPE',
    'Allows to get new competition type with indication of the area where the fox is located',
    false,
    'Foxoring competition type'
);

INSERT INTO fh_admin.feature_organization (organization_id, feature_id, is_enabled)
SELECT o.organization_id, f.feature_id, true
FROM fh_admin.organization o,
     fh_admin.feature f
WHERE o.name IN ('Public Organization', 'Radio School')
  AND f.name = 'FOXORING_COMPETITION_TYPE';
