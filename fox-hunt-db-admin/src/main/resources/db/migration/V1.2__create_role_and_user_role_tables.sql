DROP TYPE IF EXISTS ROLE CASCADE;

DROP TABLE IF EXISTS fh_admin.user_role CASCADE;

DROP TABLE IF EXISTS fh_admin.role CASCADE;
CREATE TABLE fh_admin.role
(
    id BIGSERIAL PRIMARY KEY,
    role VARCHAR(20)
);

DROP TABLE IF EXISTS fh_admin.user_role CASCADE;
CREATE TABLE fh_admin.user_role
(
    role_id BIGINT REFERENCES fh_admin.role(id),
    user_id BIGINT REFERENCES fh_admin.users(id)
);