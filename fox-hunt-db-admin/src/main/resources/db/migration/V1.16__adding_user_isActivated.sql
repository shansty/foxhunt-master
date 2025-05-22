ALTER TABLE fh_admin.app_user ADD COLUMN is_activated BOOLEAN;

UPDATE fh_admin.app_user SET is_activated = true;

ALTER TABLE fh_admin.app_user ALTER COLUMN email SET NOT NULL;