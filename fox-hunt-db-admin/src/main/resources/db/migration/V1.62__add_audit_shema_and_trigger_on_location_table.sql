DROP SCHEMA IF EXISTS journal CASCADE;
CREATE SCHEMA journal;

DROP TABLE IF EXISTS journal.location_audits CASCADE;
CREATE TABLE journal.location_audits
(
	id BIGINT GENERATED ALWAYS AS IDENTITY,
    location_id_old BIGINT,
	location_id_new BIGINT,
    name_old VARCHAR(40),
	name_new VARCHAR(40),
    description_old VARCHAR(512),
	description_new VARCHAR(512),
    zoom_old SMALLINT,
	zoom_new SMALLINT,
    center_old geometry,
	center_new geometry,
    coordinates_old geometry,
	coordinates_new geometry,
    created_date_old TIMESTAMP,
	created_date_new TIMESTAMP,
    updated_date_old TIMESTAMP,
	updated_date_new TIMESTAMP,
    created_by_old BIGINT,
	created_by_new BIGINT,
    updated_by_old BIGINT,
	updated_by_new BIGINT,
    is_global_old BOOLEAN,
	is_global_new BOOLEAN,
	changed_on TIMESTAMP NOT NULL,
	operation_type VARCHAR(20) NOT NULL
);

CREATE OR REPLACE FUNCTION process_location_audits(new_value anyelement, old_value anyelement, operation TEXT)
RETURNS VOID AS $location_audits$
    BEGIN
        INSERT INTO journal.location_audits(location_id_old, name_old, description_old, zoom_old, center_old,
									   coordinates_old, created_date_old, updated_date_old, created_by_old,
									   updated_by_old, is_global_old,
									   location_id_new, name_new, description_new, zoom_new, center_new,
									   coordinates_new, created_date_new, updated_date_new, created_by_new,
									   updated_by_new, is_global_new,
									   changed_on, operation_type)
        values(old_value.location_id, old_value.name, old_value.description, old_value.zoom,
               old_value.center, old_value.coordinates,
               old_value.created_date, old_value.updated_date, old_value.created_by,
               old_value.updated_by, old_value.is_global,
               new_value.location_id, new_value.name, new_value.description, new_value.zoom,
               new_value.center, new_value.coordinates,
               new_value.created_date, new_value.updated_date, new_value.created_by,
               new_value.updated_by, new_value.is_global,
               now(), operation);
    END;
$location_audits$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION process_location_upsert()
RETURNS TRIGGER AS $process_location_upsert$
    BEGIN
        PERFORM process_location_audits(NEW, OLD, TG_OP);
        RETURN NEW;
    END
$process_location_upsert$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION process_location_delete()
RETURNS TRIGGER AS $process_location_delete$
    BEGIN
        PERFORM process_location_audits(NEW, OLD, TG_OP);
        RETURN OLD;
    END
$process_location_delete$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS location_audits_upsert ON fh_admin.location;
CREATE TRIGGER location_audits_upsert
AFTER UPDATE OR INSERT ON fh_admin.location
    FOR EACH ROW EXECUTE PROCEDURE process_location_upsert();

DROP TRIGGER IF EXISTS location_audits_delete ON fh_admin.location;
CREATE TRIGGER location_audits_delete
AFTER DELETE ON fh_admin.location
    FOR EACH ROW EXECUTE PROCEDURE process_location_delete();
