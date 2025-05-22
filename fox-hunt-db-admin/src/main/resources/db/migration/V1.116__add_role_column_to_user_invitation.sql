ALTER TABLE fh_admin.user_invitation
    ADD COLUMN role_id bigint;
ALTER TABLE fh_admin.user_invitation
    ADD CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES fh_admin.role (role_id);

UPDATE fh_admin.user_invitation AS ui
SET role_id = our.role_id
FROM fh_admin.organization_user_role AS our WHERE ui.user_id = our.user_id;