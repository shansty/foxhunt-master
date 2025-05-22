INSERT INTO fh_admin.location (name, description, creator, zoom, created_date, updated_date, center, coordinates)
VALUES ('location1', 'description1', 'george12black', 11, '2020-02-01T17:25:00.000', '2020-02-02T18:18:59.000', 'POINT (53.908 27.567)', 'POLYGON ((
        53.907 27.566,
        53.91 27.57,
        53.907 27.568,
        53.908 27.57,
        53.907 27.566
      ))');

INSERT INTO fh_admin.location (name, description, creator, zoom, created_date, updated_date, center, coordinates)
VALUES ('location2', 'description2', 'george1', 17, '2020-01-03T09:59:00.000', '2020-02-03T14:11:00.000', 'POINT (53.908 27.567)', 'POLYGON ((
        53.907 27.566,
        53.91 27.57,
        53.907 27.568,
        53.908 27.57,
        53.907 27.566
      ))');

INSERT INTO fh_admin.distance_type(name, max_number_of_fox, distance_length)
VALUES ('M1', 2, 700);

INSERT INTO fh_admin.distance_type(name, max_number_of_fox, distance_length)
VALUES ('M2', 3, 1500);

INSERT INTO fh_admin.distance_type(name, max_number_of_fox, distance_length)
VALUES ('M3', 5, 3000);

INSERT INTO fh_admin.distance_type(name, max_number_of_fox, distance_length)
VALUES ('M4', 5, 5000);

INSERT INTO fh_admin.distance_type(name, max_number_of_fox, distance_length)
VALUES ('M5', 5, 10000);

INSERT INTO fh_admin.distance_type(name, max_number_of_fox, distance_length)
VALUES ('W1', 2, 500);

INSERT INTO fh_admin.distance_type(name, max_number_of_fox, distance_length)
VALUES ('W3', 3, 1000);

INSERT INTO fh_admin.distance_type(name, max_number_of_fox, distance_length)
VALUES ('W4', 5, 4000);

INSERT INTO fh_admin.distance_type(name, max_number_of_fox, distance_length)
VALUES ('W5', 5, 6000);

INSERT INTO fh_admin.competition (name, notes, coach, creator, location_id, distance_type, fox_amount, fox_points, start_point, finish_point, start_date, created_date, updated_date, status, fox_duration, has_silence_interval)
VALUES ('comp1', 'Fake competition', 'Fox Coach', 'george1', 1, 2, 2, 'MULTIPOINT ((53.906 27.571), (53.909 27.573))', 'POINT (53.905 27.570)', 'POINT (53.910 27.567)','2020-04-12T21:30:59.000', '2020-02-01T17:25:00.000', '2020-02-02T18:18:59.000', 'SCHEDULED', 60, 'true');

INSERT INTO fh_admin.competition (name, notes, coach, creator, location_id, distance_type, fox_amount, fox_points, start_point, finish_point, start_date, created_date, updated_date, status, fox_duration, has_silence_interval)
VALUES ('comp2', 'Best competition ever!', 'Fox Coach', 'george1', 2, 3, 1, 'MULTIPOINT ((53.906 27.572))', 'POINT (53.905 27.570)', 'POINT (53.910 27.567)','2020-04-12T21:30:59.000', '2020-01-03T09:59:00.000', '2020-02-03T14:11:00.000', 'FINISHED', 120, 'false');
