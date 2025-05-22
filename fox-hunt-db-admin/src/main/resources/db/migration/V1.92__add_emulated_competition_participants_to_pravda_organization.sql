INSERT INTO fh_admin.organization_user_role (role_id, user_id, organization_id, is_active)
SELECT role_id, app_user_id AS user_id, organization_id, true FROM fh_admin.app_user, fh_admin.role, fh_admin.organization
WHERE email IN ('Anton.Zavalski@foxhunt.com', 'Nikolai.Grushevski@foxhunt.com',
                'Ilya.kuzminovich@foxhunt.com', 'Boris.Frolov@foxhunt.com',
                'Anna.Grumenko@foxhunt.com', 'Larisa.Astavets@foxhunt.com',
                'Vita.Simonovich@foxhunt.com', 'Irina.Veznovets@foxhunt.com')
AND role = 'PARTICIPANT'
AND org_domain = 'pravda';