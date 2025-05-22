INSERT INTO fh_admin.organization_user_role (role_id, user_id, organization_id)
VALUES ((SELECT role_id FROM fh_admin.role WHERE role = 'ORGANIZATION_ADMIN'),
        (SELECT app_user_id FROM fh_admin.app_user WHERE email = 'alexander.belyaev@itechart-group.com'),
        (SELECT organization_id FROM fh_admin.organization WHERE is_system = TRUE));
