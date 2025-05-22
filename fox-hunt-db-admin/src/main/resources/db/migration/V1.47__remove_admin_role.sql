WITH org_admin_role(role_id) AS (SELECT r.id FROM fh_admin.role r WHERE r.role = 'ORGANIZATION_ADMIN'),
     admin_role(role_id) AS (SELECT r.id FROM fh_admin.role r WHERE r.role = 'ADMIN')
UPDATE fh_admin.organization_user_role SET role_id = (SELECT role_id FROM org_admin_role) WHERE role_id = (SELECT role_id FROM admin_role);

DELETE FROM fh_admin.role WHERE role = 'ADMIN';
