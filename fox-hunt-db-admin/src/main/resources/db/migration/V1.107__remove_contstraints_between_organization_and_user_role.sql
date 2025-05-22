ALTER TABLE fh_admin.organization
    ALTER COLUMN root_user_id DROP NOT NULL;
ALTER TABLE fh_admin.organization_user_role
    DROP CONSTRAINT organization_user_role_organization_id_fkey;
ALTER TABLE fh_admin.user_invitation
    DROP CONSTRAINT user_invitation_organization_id_fkey;