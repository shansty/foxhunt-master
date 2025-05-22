DROP TABLE IF EXISTS fh_admin.competition_result CASCADE;
CREATE TABLE fh_admin.competition_result
(
    id BIGSERIAL PRIMARY KEY,
    fox_point_id BIGINT REFERENCES fh_admin.fox_point(id),

    competition_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    visit_date TIMESTAMP,

    FOREIGN KEY (competition_id, user_id) REFERENCES fh_admin.competition_participant (competition_id, user_id),
    UNIQUE (fox_point_id, competition_id, user_id)

);
