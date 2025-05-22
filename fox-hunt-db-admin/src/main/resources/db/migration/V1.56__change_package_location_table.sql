ALTER TABLE fh_admin.location_package
    ADD COLUMN description VARCHAR(512) NULL;

UPDATE fh_admin.location_package
SET description = 'Global package'
