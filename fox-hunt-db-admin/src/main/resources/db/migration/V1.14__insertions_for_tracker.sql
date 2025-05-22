INSERT INTO fh_admin.location_tracker (participant_id, competition_id)
VALUES (1, 2);
INSERT INTO fh_admin.location_tracker (participant_id, competition_id)
VALUES (2, 2);
INSERT INTO fh_admin.location_tracker (participant_id, competition_id)
VALUES (3, 2);

INSERT INTO fh_admin.path_story (location_tracker_id, game_time, current_place, active_fox_id)
VALUES (1, '2020-01-03T09:59:00.000', 'POINT (53.908 27.567)', 1);

INSERT INTO fh_admin.path_story (location_tracker_id, game_time, current_place, active_fox_id)
VALUES (1, '2020-01-03T09:59:15.000', 'POINT (55.9643 23.510)', 3);

INSERT INTO fh_admin.path_story (location_tracker_id, game_time, current_place, active_fox_id)
VALUES (1, '2020-01-03T09:59:30.000', 'POINT (41.908 22.567)', 2);

INSERT INTO fh_admin.path_story (location_tracker_id, game_time, current_place, active_fox_id)
VALUES (2, '2020-01-03T09:59:00.000', 'POINT (53.908 27.567)', 1);

INSERT INTO fh_admin.path_story (location_tracker_id, game_time, current_place, active_fox_id)
VALUES (2, '2020-01-03T09:59:15.000', 'POINT (55.9643 23.510)', 3);

INSERT INTO fh_admin.path_story (location_tracker_id, game_time, current_place, active_fox_id)
VALUES (2, '2020-01-03T09:59:30.000', 'POINT (41.908 22.567)', 2);

INSERT INTO fh_admin.path_story (location_tracker_id, game_time, current_place, active_fox_id)
VALUES (3, '2020-01-03T09:59:00.000', 'POINT (53.908 27.567)', 1);

INSERT INTO fh_admin.path_story (location_tracker_id, game_time, current_place, active_fox_id)
VALUES (3, '2020-01-03T09:59:15.000', 'POINT (55.9643 23.510)', 3);

INSERT INTO fh_admin.path_story (location_tracker_id, game_time, current_place, active_fox_id)
VALUES (3, '2020-01-03T09:59:30.000', 'POINT (41.908 22.567)', 2);
