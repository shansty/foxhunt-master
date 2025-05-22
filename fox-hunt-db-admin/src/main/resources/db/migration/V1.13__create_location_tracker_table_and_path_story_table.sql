DROP TABLE IF EXISTS fh_admin.location_tracker CASCADE;
CREATE TABLE fh_admin.location_tracker
(
    id BIGSERIAL PRIMARY KEY,
    participant_id BIGINT REFERENCES fh_admin.app_user(id),
    competition_id BIGINT REFERENCES fh_admin.competition(id)
);

DROP TABLE IF EXISTS fh_admin.path_story CASCADE;
CREATE TABLE fh_admin.path_story
(
    id BIGSERIAL PRIMARY KEY,
    location_tracker_id BIGINT REFERENCES fh_admin.location_tracker(id),
    game_time TIMESTAMP,
    current_place GEOMETRY,
    active_fox_id BIGINT REFERENCES fh_admin.fox_point(id)
);
