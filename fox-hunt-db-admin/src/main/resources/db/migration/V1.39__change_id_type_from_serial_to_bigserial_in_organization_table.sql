ALTER SEQUENCE fh_admin.organization_organization_id_seq AS BIGINT;
ALTER TABLE fh_admin.organization ALTER organization_id TYPE BIGINT;

ALTER TABLE fh_admin.organization_user_role
    ALTER COLUMN organization_id SET DATA TYPE BIGINT;
