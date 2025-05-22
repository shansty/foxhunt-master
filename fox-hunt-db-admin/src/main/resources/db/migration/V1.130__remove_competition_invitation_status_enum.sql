ALTER TABLE fh_admin.competition_invitation ALTER COLUMN status TYPE VARCHAR(255) USING status::text;
ALTER TABLE fh_admin.competition_invitation ALTER COLUMN status SET DEFAULT 'PENDING';

DROP TYPE competition_invitation_status;