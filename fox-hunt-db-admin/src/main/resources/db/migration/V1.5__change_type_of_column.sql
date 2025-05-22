ALTER TABLE fh_admin.competition
    DROP COLUMN coach CASCADE;

ALTER TABLE fh_admin.competition ADD COLUMN coach_id BIGINT REFERENCES fh_admin.app_user(id);
