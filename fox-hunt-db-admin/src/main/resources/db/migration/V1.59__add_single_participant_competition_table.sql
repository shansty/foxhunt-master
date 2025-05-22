DROP TABLE IF EXISTS fh_admin.single_participant_competition CASCADE;
CREATE TABLE fh_admin.single_participant_competition
(
    single_participant_competition_id BIGSERIAL PRIMARY KEY,
    competition jsonb NOT NULL DEFAULT '{}'::jsonb
);
