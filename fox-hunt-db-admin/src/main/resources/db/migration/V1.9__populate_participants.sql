INSERT INTO fh_admin.app_user(id, first_name, last_name, date_of_birth, country, city, email, login, password)
VALUES (4, 'Vasya', 'Galkin', '1995-02-01T17:25:00.000', 'Belarus', 'Minsk', '16231@gmail.com', 'vasya.galk', '555555');

INSERT INTO fh_admin.app_user(id, first_name, last_name, date_of_birth, country, city, email, login, password)
VALUES (5, 'Stepan', 'Vingradov', '1995-02-01T17:25:00.000', 'Belarus', 'Minsk', '234@gmail.com', 'stepan.vinagrad', '12312666663123');

INSERT INTO fh_admin.app_user(id, first_name, last_name, date_of_birth, country, city, email, login, password)
VALUES (6, 'Sveta', 'Rukhina', '1995-02-01T17:25:00.000', 'Belarus', 'Minsk', '1999993@gmail.com', 'sveta.rukhina', '769696');

INSERT INTO fh_admin.app_user(id, first_name, last_name, date_of_birth, country, city, email, login, password)
VALUES (7, 'Vitya', 'Petrov', '1995-02-01T17:25:00.000', 'Belarus', 'Minsk', '45674@gmail.com', 'vitya.petrov', '567845687');

INSERT INTO fh_admin.app_user(id, first_name, last_name, date_of_birth, country, city, email, login, password)
VALUES (8, 'Vitaly', 'Polkon', '1995-02-01T17:25:00.000', 'Belarus', 'Minsk', '6754@gmail.com', 'vitaly.polkon', '909097896');

INSERT INTO fh_admin.user_role(role_id, user_id)
VALUES (3, 4);

INSERT INTO fh_admin.user_role(role_id, user_id)
VALUES (3, 5);

INSERT INTO fh_admin.user_role(role_id, user_id)
VALUES (3, 6);

INSERT INTO fh_admin.user_role(role_id, user_id)
VALUES (3, 7);

INSERT INTO fh_admin.user_role(role_id, user_id)
VALUES (3, 8);

INSERT INTO fh_admin.competition_participant(user_id, competition_id)
VALUES(4,1);

INSERT INTO fh_admin.competition_participant(user_id, competition_id)
VALUES(5,1);

INSERT INTO fh_admin.competition_participant(user_id, competition_id)
VALUES(6,1);

INSERT INTO fh_admin.competition_participant(user_id, competition_id)
VALUES(7,1);

INSERT INTO fh_admin.competition_participant(user_id, competition_id)
VALUES(8,1);

INSERT INTO fh_admin.competition_participant(user_id, competition_id)
VALUES(7,2);

INSERT INTO fh_admin.competition_participant(user_id, competition_id)
VALUES(8,2);