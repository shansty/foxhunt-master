-- User insertions

INSERT INTO fh_admin.app_user(id, first_name, last_name, date_of_birth, country, city, email, login, password)
VALUES (1, 'Petya', 'Utochkin', '2000-02-01T17:25:00.000', 'Belarus', 'Minsk', '1123@gmail.com', 'petya.utochkin', '123123123');

INSERT INTO fh_admin.app_user(id, first_name, last_name, date_of_birth, country, city, email, login, password)
VALUES (2, 'Vasya', 'Pupkin', '1998-02-01T17:25:00.000', 'Belarus', 'Minsk', '1323@gmail.com', 'vasya.pupkin', '123123123');

INSERT INTO fh_admin.app_user(id, first_name, last_name, date_of_birth, country, city, email, login, password)
VALUES (3, 'Roma', 'Petrvo', '1995-02-01T17:25:00.000', 'Belarus', 'Minsk', '1623@gmail.com', 'roma.petrov', '123123123');

-- Role insertions

INSERT INTO fh_admin.role(id, role)
VALUES (1, 'COACH');

INSERT INTO fh_admin.role(id, role)
VALUES (2, 'ADMIN');

INSERT INTO fh_admin.role(id, role)
VALUES (3, 'PARTICIPANT');

-- User Role insertions

INSERT INTO fh_admin.user_role(role_id, user_id)
VALUES (1, 1);

INSERT INTO fh_admin.user_role(role_id, user_id)
VALUES (2, 1);

INSERT INTO fh_admin.user_role(role_id, user_id)
VALUES (1, 2);

INSERT INTO fh_admin.user_role(role_id, user_id)
VALUES (3, 3);
