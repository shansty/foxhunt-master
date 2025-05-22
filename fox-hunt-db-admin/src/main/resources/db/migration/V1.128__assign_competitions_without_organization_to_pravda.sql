UPDATE fh_admin.competition
SET organization_id = org.organization_id
FROM fh_admin.organization org
WHERE org_domain = 'pravda';