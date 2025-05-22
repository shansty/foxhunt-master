ALTER TABLE fh_admin.location
    ADD COLUMN created_by BIGINT NULL;

UPDATE fh_admin.location
SET created_by = (SELECT id FROM fh_admin.app_user WHERE last_name = 'Belyaev');

ALTER TABLE fh_admin.location
    ALTER COLUMN created_by SET NOT NULL;

ALTER TABLE fh_admin.location
    ADD FOREIGN KEY (created_by) REFERENCES fh_admin.app_user (id);

ALTER TABLE fh_admin.location
    ADD COLUMN updated_by BIGINT NULL;

ALTER TABLE fh_admin.location
    ADD FOREIGN KEY (updated_by) REFERENCES fh_admin.app_user (id);

ALTER TABLE fh_admin.location
    DROP COLUMN IF EXISTS creator;