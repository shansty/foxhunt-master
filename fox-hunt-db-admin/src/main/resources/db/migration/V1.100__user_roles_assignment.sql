DELETE
FROM fh_admin.organization_user_role user_role
WHERE user_role.user_id in (
    SELECT user_role.user_id
    FROM fh_admin.organization_user_role user_role
    INNER JOIN fh_admin.app_user app_user ON user_role.user_id = app_user.app_user_id
    WHERE app_user.email = 'alexander.belyaev@itechart-group.com'
    AND app_user.app_user_id = user_role.user_id
);

DELETE FROM fh_admin.app_user WHERE email = 'alexander.belyaev@itechart-group.com';

UPDATE fh_admin.app_user SET email = 'alexander.belyaev@itechart-group.com' WHERE email = 'Alexander.belyaev@itechart-group.com';

INSERT INTO fh_admin.organization_user_role(role_id, user_id, organization_id, is_active)
SELECT fh_admin.role.role_id, fh_admin.app_user.app_user_id, fh_admin.organization.organization_id, true
FROM fh_admin.role,
     fh_admin.app_user,
     fh_admin.organization
WHERE fh_admin.organization.is_system
  AND fh_admin.role.role = 'SYSTEM_ADMIN'
  AND fh_admin.app_user.email = 'alexander.belyaev@itechart-group.com';