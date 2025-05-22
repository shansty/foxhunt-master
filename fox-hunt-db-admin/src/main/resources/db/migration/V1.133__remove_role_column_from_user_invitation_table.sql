ALTER TABLE fh_admin.user_invitation DROP CONSTRAINT IF EXISTS fk_role;

ALTER TABLE fh_admin.user_invitation DROP COLUMN IF EXISTS role_id;