ALTER TABLE fh_admin.location ADD COLUMN is_global BOOLEAN DEFAULT FALSE;

DROP TYPE IF EXISTS fh_admin.location_package_type CASCADE;
CREATE TYPE fh_admin.location_package_type AS ENUM (
	'SYSTEM', 'SHARED', 'PRIVATE'
);

DROP TABLE IF EXISTS fh_admin.location_package CASCADE;
CREATE TABLE fh_admin.location_package (
	location_package_id BIGSERIAL PRIMARY KEY,
	name VARCHAR(40) NOT NULL,
	center GEOMETRY NOT NULL,
	coordinates GEOMETRY NOT NULL,
	zoom SMALLINT DEFAULT 10 NOT NULL,
	creation_date TIMESTAMP NOT NULL,
	update_date TIMESTAMP,
	created_by BIGINT REFERENCES fh_admin.app_user(id) NOT NULL,
	updated_by BIGINT REFERENCES fh_admin.app_user(id),
	type fh_admin.location_package_type DEFAULT 'SYSTEM'
);

DROP TABLE IF EXISTS fh_admin.location_package_location CASCADE;
CREATE TABLE fh_admin.location_package_location (
    location_package_id BIGINT REFERENCES fh_admin.location_package(location_package_id),
    location_id BIGINT REFERENCES fh_admin.location(id),
    PRIMARY KEY(location_package_id, location_id)
);

INSERT INTO fh_admin.location (name, description, zoom, created_date, updated_date, center, coordinates, is_global, created_by)
VALUES ('Red carpets', 'description2', 10, '2020-01-03T09:59:00.000', '2020-02-03T14:11:00.000', 'POINT (53.907 27.567)',
        'POLYGON ((
       54.03431773685757 27.266935913085927,
       54.01329375223019 27.372679321289034,
       53.940435949543364 27.293028442382788,
       54.03431773685757 27.266935913085927 ))', TRUE, 1);

INSERT INTO fh_admin.location (name, description, zoom, created_date, updated_date, center, coordinates, is_global, created_by)
VALUES ('Wild forest', 'description2', 10, '2020-01-03T09:59:00.000', '2020-02-03T14:11:00.000', 'POINT (53.907 27.567)',
        'POLYGON ((
       53.99225908958538 27.334227172851545,
       53.991449850818654 27.724241821289045,
       53.907202723159244 27.84097155761716,
       53.99225908958538 27.334227172851545 ))', TRUE, 1);

INSERT INTO fh_admin.location (name, description, zoom, created_date, updated_date, center, coordinates, is_global, created_by)
VALUES ('Zelyonoe', 'description2', 10, '2020-01-03T09:59:00.000', '2020-02-03T14:11:00.000', 'POINT (53.907 27.567)',
        'POLYGON ((
       53.98335659412916 27.71050891113279,
       53.98497537187391 27.846464721679673,
       53.93719485361804 27.58691271972654,
       53.986594086414016 27.626738159179677,
       53.98335659412916 27.71050891113279 ))', TRUE, 1);



