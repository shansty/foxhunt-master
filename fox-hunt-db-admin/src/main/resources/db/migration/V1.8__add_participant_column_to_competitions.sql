DROP TABLE IF EXISTS fh_admin.competition_participant CASCADE;
CREATE TABLE fh_admin.competition_participant
(
    user_id BIGINT REFERENCES fh_admin.app_user(id),
    competition_id BIGINT REFERENCES fh_admin.competition(id)
);
