
INSERT INTO fh_admin.app_user (
    first_name,
    last_name,
    date_of_birth,
    country,
    city,
    email,
    password,
    is_activated,
    activated_since
) VALUES (
    'Anastasiya',
    'Shyrochyna',
    '1999-05-16 00:00:00.000',
    'Poland',
    'Warsaw',
    'shirochina16@gmail.com',
    '$2a$10$.gx4vHNa5ZzGgr/vyaK6de2ALGHNNsnc6gVH9b7n/6SiHfcgGjDfK',
    true,
    '2020-11-04 05:35:15.717'
);

INSERT INTO fh_admin.organization_user_role (
    role_id,
    user_id,
    organization_id,
    is_active
)
SELECT 4, app_user_id, 1, true
FROM fh_admin.app_user
WHERE email = 'shirochina16@gmail.com';

INSERT INTO fh_admin.organization_user_role (
    role_id,
    user_id,
    organization_id,
    is_active
)
SELECT 1, app_user_id, 1, true
FROM fh_admin.app_user
WHERE email = 'shirochina16@gmail.com';
