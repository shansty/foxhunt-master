ALTER SEQUENCE fh_admin.app_user_id_seq RENAME TO app_user_app_user_id_seq;

ALTER TABLE fh_admin.app_user
    RENAME COLUMN id TO app_user_id;

ALTER SEQUENCE fh_admin.competition_id_seq RENAME TO competition_competition_id_seq;

ALTER TABLE fh_admin.competition
    RENAME COLUMN id TO competition_id;

ALTER SEQUENCE fh_admin.competition_result_id_seq RENAME TO competition_result_competition_result_id_seq;

ALTER TABLE fh_admin.competition_result
    RENAME COLUMN id TO competition_result_id;

ALTER SEQUENCE fh_admin.distance_type_id_seq RENAME TO distance_type_distance_type_id_seq;

ALTER TABLE fh_admin.distance_type
    RENAME COLUMN id TO distance_type_id;

ALTER SEQUENCE fh_admin.fox_point_id_seq RENAME TO fox_point_fox_point_id_seq;

ALTER TABLE fh_admin.fox_point
    RENAME COLUMN id TO fox_point_id;

ALTER SEQUENCE fh_admin.location_id_seq RENAME TO location_location_id_seq;

ALTER TABLE fh_admin.location
    RENAME COLUMN id TO location_id;

ALTER SEQUENCE fh_admin.location_tracker_id_seq RENAME TO location_tracker_location_tracker_id_seq;

ALTER TABLE fh_admin.location_tracker
    RENAME COLUMN id TO location_tracker_id;

ALTER SEQUENCE fh_admin.role_id_seq RENAME TO role_role_id_seq;

ALTER TABLE fh_admin.role
    RENAME COLUMN id TO role_id;

ALTER SEQUENCE fh_admin.path_story_id_seq RENAME TO path_story_path_story_id_seq;

ALTER TABLE fh_admin.path_story
    RENAME COLUMN id TO path_story_id;

ALTER TABLE fh_admin.path_story_ranked
    RENAME COLUMN id TO path_story_id;