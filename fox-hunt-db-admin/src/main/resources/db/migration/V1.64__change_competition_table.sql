ALTER TABLE fh_admin.competition
    ALTER COLUMN frequency DROP NOT NULL;

ALTER TABLE fh_admin.competition
    ADD COLUMN created_by BIGINT NULL;

ALTER TABLE fh_admin.competition
    ADD FOREIGN KEY (created_by) REFERENCES fh_admin.app_user (app_user_id);

UPDATE fh_admin.competition
SET created_by = (SELECT app_user_id FROM fh_admin.app_user WHERE last_name = 'Belyaev');

ALTER TABLE fh_admin.competition
    ALTER COLUMN created_by SET NOT NULL;

ALTER TABLE fh_admin.competition
    DROP COLUMN IF EXISTS creator;