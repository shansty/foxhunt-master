ALTER TABLE fh_admin.competition
    ADD COLUMN location jsonb NOT NULL default '{}'::jsonb;

ALTER TABLE fh_admin.location
    ADD COLUMN revision INT4 DEFAULT 1;

WITH location_json AS (
    SELECT json_build_object('id', l.location_id,
                             'name', l.name,
                             'description', l.description,
                             'center', l.center,
                             'coordinates', l.coordinates,
                             'revision', l.revision,
                             'forbiddenAreas', CASE
                                                   WHEN areas.jobject IS NULL THEN '[]'::jsonb
                                                   ELSE areas.jobject::jsonb END) AS json_object
    FROM (SELECT l.*
          FROM fh_admin.competition c
                   INNER JOIN fh_admin.location l ON c.location_id = l.location_id
          GROUP BY l.location_id) l
             LEFT JOIN (SELECT fa.location_id,
                               array_to_json(ARRAY_AGG(ST_AsGeoJSON(fa.coordinates)::jsonb)) jobject
                        FROM fh_admin.location l
                                 INNER JOIN fh_admin.forbidden_area fa ON l.location_id = fa.location_id
                        GROUP BY fa.location_id) AS areas ON areas.location_id = l.location_id
)

UPDATE fh_admin.competition
SET location = (SELECT l_json.json_object
                FROM location_json l_json
                WHERE location_id = (l_json.json_object ->> 'id')::int8);

ALTER TABLE fh_admin.competition
    DROP COLUMN location_id;





