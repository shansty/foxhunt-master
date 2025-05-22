DROP TABLE IF EXISTS fh_admin.forbidden_area CASCADE;
CREATE TABLE fh_admin.forbidden_area
(
    forbidden_area_id BIGSERIAL PRIMARY KEY,
    coordinates       GEOMETRY NOT NULL,
    location_id BIGINT REFERENCES fh_admin.location (location_id)
);
