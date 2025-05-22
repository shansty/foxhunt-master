INSERT INTO fh_admin.feature(name, description, is_globally_enabled)
VALUES ('COMPETITION_TEMPLATE_MANAGEMENT', 'Access to create competitions by templates and appropriate backend endpoints', false) ;

INSERT INTO fh_admin.feature_organization(organization_id, feature_id, is_enabled)
SELECT o.organization_id, f.feature_id, true
from fh_admin.organization o,
     fh_admin.feature f
WHERE o.name IN ('Public Organization', 'Radio School')
  AND f.name = 'COMPETITION_TEMPLATE_MANAGEMENT';
