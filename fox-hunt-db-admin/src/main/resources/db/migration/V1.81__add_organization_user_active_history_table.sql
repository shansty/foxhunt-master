DROP TABLE IF EXISTS fh_admin.organization_user_active_history;
CREATE TABLE fh_admin.organization_user_active_history
(
    organization_user_active_history_id BIGSERIAL PRIMARY KEY,
    organization_id                     BIGINT    NOT NULL REFERENCES fh_admin.organization (organization_id),
    app_user_id                         BIGINT    NOT NULL REFERENCES fh_admin.app_user (app_user_id),
    is_active                           BOOLEAN   NOT NULL,
    date                                timestamp NOT NULL
)