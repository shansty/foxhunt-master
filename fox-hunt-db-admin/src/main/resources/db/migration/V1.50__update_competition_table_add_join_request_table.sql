ALTER TABLE fh_admin.competition ADD COLUMN is_private BOOLEAN NOT NULL DEFAULT false;

CREATE TYPE COMPETITION_INVITATION_STATUS AS ENUM ('ACCEPTED', 'DECLINED', 'PENDING');

DROP TABLE IF EXISTS fh_admin.competition_invitation CASCADE;
CREATE TABLE fh_admin.competition_invitation
(
    competition_invitation_id BIGSERIAL PRIMARY KEY,
    participant_id BIGINT REFERENCES fh_admin.app_user(id) NOT NULL,
    competition_id BIGINT REFERENCES fh_admin.competition(id) NOT NULL,
    status COMPETITION_INVITATION_STATUS DEFAULT 'PENDING',
    source VARCHAR(20) NOT NULL,
    created_at timestamp NOT NULL,
    updated_at timestamp
);