ALTER TABLE fh_admin.competition DROP COLUMN fox_points;

DROP TABLE IF EXISTS fh_admin.fox_points CASCADE;
CREATE TABLE fh_admin.fox_points
(
    id BIGSERIAL PRIMARY KEY,
    competition_id BIGINT REFERENCES fh_admin.competition(id),
    index INT,
    label VARCHAR(40),
    coordinates GEOMETRY
);

INSERT INTO fh_admin.fox_points(competition_id, index, label, coordinates)
VALUES (1, 1, 'F1', 'POINT (53.906 27.571)'),
       (1, 2, 'F2', 'POINT (53.909 27.573)'),
       (2, 1, 'V1', 'POINT (53.906 27.572)');