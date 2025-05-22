ALTER TABLE fh_admin.organization_user_role
    ADD COLUMN is_active BOOLEAN NOT NULL default true;