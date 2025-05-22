UPDATE fh_admin.app_user
	SET is_activated = false
	WHERE is_activated is NULL;

ALTER TABLE fh_admin.app_user
    ALTER COLUMN is_activated SET NOT NULL,
    ALTER COLUMN is_activated SET DEFAULT false;