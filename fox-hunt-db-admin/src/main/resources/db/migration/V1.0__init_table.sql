CREATE EXTENSION IF NOT EXISTS postgis;

DROP TYPE IF EXISTS STATUS CASCADE;
CREATE TYPE STATUS AS ENUM ('SCHEDULED', 'CANCELED', 'RUNNING', 'FINISHED');

DROP TYPE IF EXISTS ROLE CASCADE;
CREATE TYPE ROLE AS ENUM ('PARTICIPANT', 'COACH', 'ADMIN');

DROP SCHEMA IF EXISTS fh_admin CASCADE;
CREATE SCHEMA fh_admin;

DROP TABLE IF EXISTS fh_admin.location CASCADE;
CREATE TABLE fh_admin.location
(
	id BIGSERIAL PRIMARY KEY,
	name VARCHAR(40) UNIQUE,
	description VARCHAR(512),
	creator VARCHAR(40) DEFAULT 'Creator',
	zoom SMALLINT DEFAULT 10,
	center GEOMETRY,
	coordinates GEOMETRY,
	created_date TIMESTAMP,
	updated_date TIMESTAMP
);

DROP TABLE IF EXISTS fh_admin.distance_type CASCADE;
CREATE TABLE fh_admin.distance_type
(
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(3) UNIQUE,
    max_number_of_fox INT,
    distance_length INT
);

DROP TABLE IF EXISTS fh_admin.competition CASCADE;
CREATE TABLE fh_admin.competition
(
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(40) UNIQUE,
    notes VARCHAR(512),
    coach VARCHAR(40),
    creator VARCHAR(40),
    location_id BIGINT REFERENCES fh_admin.location(id),
    distance_type BIGINT REFERENCES fh_admin.distance_type(id),
    fox_amount SMALLINT,
    fox_points GEOMETRY,
    start_point GEOMETRY,
    finish_point GEOMETRY,
    start_date TIMESTAMP,
    created_date TIMESTAMP,
    updated_date TIMESTAMP,
    status STATUS DEFAULT 'SCHEDULED',
    fox_duration INT,
    has_silence_interval BOOLEAN
);

DROP TABLE IF EXISTS fh_admin.users CASCADE;
CREATE TABLE fh_admin.users
(
    id BIGINT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    date_of_birth TIMESTAMP,
    country VARCHAR(255),
    city VARCHAR(255),
    email VARCHAR(40) UNIQUE,
    login VARCHAR(40) UNIQUE,
    password VARCHAR(255)
);

DROP TABLE IF EXISTS fh_admin.user_role CASCADE;
CREATE TABLE fh_admin.user_role
(
    id BIGSERIAL PRIMARY KEY,
    role ROLE,
    user_id BIGINT REFERENCES fh_admin.users(id)
);
