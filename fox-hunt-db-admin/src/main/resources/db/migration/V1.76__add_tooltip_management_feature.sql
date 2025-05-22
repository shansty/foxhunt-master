INSERT INTO fh_admin.feature (name, description, is_globally_enabled)
VALUES ('TOOLTIP_MANAGEMENT',
        'Access to create and edit tooltips',
        false);

INSERT INTO fh_admin.feature_organization(organization_id, feature_id, is_enabled)
SELECT o.organization_id, f.feature_id, true
from fh_admin.organization o,
     fh_admin.feature f
WHERE o.name = 'Public Organization'
  AND f.name = 'TOOLTIP_MANAGEMENT';