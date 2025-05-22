DROP TABLE IF EXISTS fh_admin.user_feedback CASCADE;
CREATE TABLE fh_admin.user_feedback
(
    user_feedback_id BIGSERIAL PRIMARY KEY,
    user_id          BIGINT REFERENCES fh_admin.app_user (app_user_id) NOT NULL,
    organization_id  BIGINT REFERENCES fh_admin.organization (organization_id),
    send_date        TIMESTAMP                                         NOT NULL,
    comment          VARCHAR,
    ranking          INT,
    CONSTRAINT CheckRanking CHECK (ranking BETWEEN 0 and 5)
);
