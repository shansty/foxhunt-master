DROP VIEW IF EXISTS fh_admin.path_story_ranked CASCADE;

SELECT UpdateGeometrySRID('location', 'locations', 'coordinates', 4326);
SELECT UpdateGeometrySRID('location', 'locations', 'center', 4326);

SELECT UpdateGeometrySRID('fh_admin', 'forbidden_area', 'coordinates', 4326);
SELECT UpdateGeometrySRID('fh_admin', 'fox_point', 'coordinates', 4326);

SELECT UpdateGeometrySRID('fh_admin', 'path_story', 'current_place', 4326);

SELECT UpdateGeometrySRID('location', 'location_packages', 'center', 4326);
SELECT UpdateGeometrySRID('location', 'location_packages', 'coordinates', 4326);

CREATE OR REPLACE VIEW fh_admin.path_story_ranked
            (path_story_id, location_tracker_id, game_time, current_place, active_fox_id, time_to_fox_change, rank) AS
SELECT ps.path_story_id,
       ps.location_tracker_id,
       ps.game_time,
       ps.current_place,
       ps.active_fox_id,
       ps.time_to_fox_change,
       rank() OVER (PARTITION BY ps.location_tracker_id ORDER BY ps.game_time DESC) AS rank
FROM fh_admin.path_story ps;

CREATE OR REPLACE FUNCTION location.f_is_within_earth_coordinates(_location_ geometry)
    RETURNS TABLE
            (
                is_valid boolean
            )
    LANGUAGE PLPGSQL
AS
$func$
BEGIN
    RETURN QUERY
        SELECT *
        FROM ST_Within(_location_,
                       ST_GeomFromText('POLYGON((-179.9 -85,-179.9 85, 180 85, 180 -85,-179.9 -85))',4326)) AS is_valid;
END
$func$;

