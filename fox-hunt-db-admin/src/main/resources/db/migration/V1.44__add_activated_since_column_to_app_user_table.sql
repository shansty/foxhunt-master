ALTER TABLE fh_admin.app_user ADD COLUMN activated_since TIMESTAMP;

UPDATE fh_admin.app_user
SET activated_since = timestamp '2020-01-01 00:00:00' +
                      random() * (timestamp '2020-11-12 20:00:00' - timestamp '2020-01-01 00:00:00')
WHERE is_activated = true;
