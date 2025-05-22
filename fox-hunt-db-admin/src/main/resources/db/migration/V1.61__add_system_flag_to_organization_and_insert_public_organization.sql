ALTER TABLE fh_admin.organization
ADD COLUMN is_system BOOLEAN NOT NULL DEFAULT false;

WITH public_organization(organization_id) AS (INSERT INTO fh_admin.organization(name, legal_address, actual_address,
org_domain, root_user_id, type, approximate_employees_amount, is_system, status)
         VALUES ('Public Organization', 'Belarus', 'Minsk', 'public',
         1, 'FREE', 1, true, 'ACTIVE') RETURNING organization_id)

UPDATE fh_admin.location_package
SET organization_id = (SELECT organization_id FROM public_organization)
WHERE organization_id is NULL;

CREATE UNIQUE INDEX only_one_system_organization_allowed
ON fh_admin.organization (is_system) WHERE (is_system);

INSERT INTO fh_admin.organization_user_role (role_id, user_id, organization_id)
VALUES ((SELECT role_id FROM fh_admin.role WHERE role = 'TRAINER'),
(SELECT app_user_id FROM fh_admin.app_user WHERE email = '1123@gmail.com'),
(SELECT organization_id FROM fh_admin.organization WHERE name = 'Public Organization'));