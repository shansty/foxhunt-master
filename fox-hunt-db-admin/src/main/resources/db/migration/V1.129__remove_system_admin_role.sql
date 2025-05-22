DELETE
FROM fh_admin.organization_user_role
WHERE role_id IN (
    SELECT role_id
    FROM fh_admin.role
    WHERE role='SYSTEM_ADMIN'
);

DELETE
FROM fh_admin.user_invitation
WHERE role_id IN (
    SELECT role_id
    FROM fh_admin.role
    WHERE role='SYSTEM_ADMIN'
);

DELETE
FROM fh_admin.role
WHERE role='SYSTEM_ADMIN';