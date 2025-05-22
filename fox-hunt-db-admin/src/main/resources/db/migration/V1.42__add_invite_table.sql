DROP TYPE IF EXISTS fh_admin.user_invitation_status CASCADE;
CREATE TYPE fh_admin.user_invitation_status AS ENUM (
	'NEW', 'ACCEPTED', 'DECLINED', 'EXPIRED'
);

DROP TABLE IF EXISTS fh_admin.user_invitation CASCADE;
CREATE TABLE fh_admin.user_invitation (
    user_invitation_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES fh_admin.app_user(id) NOT NULL,
    organization_id BIGSERIAL REFERENCES fh_admin.organization(organization_id) NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    token VARCHAR(50) NOT NULL,
    status fh_admin.user_invitation_status DEFAULT 'NEW'
);