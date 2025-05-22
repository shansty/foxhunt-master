DROP TABLE IF EXISTS fh_admin.tooltip CASCADE;
CREATE TABLE fh_admin.tooltip
(
    tooltip_id BIGSERIAL PRIMARY KEY,
    code       VARCHAR(155) NOT NULL UNIQUE,
    message    VARCHAR     NOT NULL
);
