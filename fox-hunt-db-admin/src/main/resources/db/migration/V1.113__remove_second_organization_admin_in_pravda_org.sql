DELETE
FROM fh_admin.organization_user_role AS our
    USING fh_admin.app_user AS u
WHERE our.user_id = u.app_user_id
  AND u.email = 'radioschooladmin@mail.com';