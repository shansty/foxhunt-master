INSERT INTO fh_admin.organization_user_role (role_id, user_id, organization_id)
VALUES ((SELECT role_id FROM fh_admin.role WHERE role = 'PARTICIPANT'),
        (SELECT app_user_id FROM fh_admin.app_user WHERE email = 'Boris.Frolov@foxhunt.com'),
        (SELECT organization_id FROM fh_admin.organization WHERE is_system = TRUE)),
       ((SELECT role_id FROM fh_admin.role WHERE role = 'PARTICIPANT'),
        (SELECT app_user_id FROM fh_admin.app_user WHERE email = 'Larisa.Astavets@foxhunt.com'),
        (SELECT organization_id FROM fh_admin.organization WHERE is_system = TRUE)),
       ((SELECT role_id FROM fh_admin.role WHERE role = 'PARTICIPANT'),
        (SELECT app_user_id FROM fh_admin.app_user WHERE email = 'Vita.Simonovich@foxhunt.com'),
        (SELECT organization_id FROM fh_admin.organization WHERE is_system = TRUE)),
       ((SELECT role_id FROM fh_admin.role WHERE role = 'PARTICIPANT'),
        (SELECT app_user_id FROM fh_admin.app_user WHERE email = 'Irina.Veznovets@foxhunt.com'),
        (SELECT organization_id FROM fh_admin.organization WHERE is_system = TRUE)),
       ((SELECT role_id FROM fh_admin.role WHERE role = 'PARTICIPANT'),
        (SELECT app_user_id FROM fh_admin.app_user WHERE email = 'Anna.Grumenko@foxhunt.com'),
        (SELECT organization_id FROM fh_admin.organization WHERE is_system = TRUE));


