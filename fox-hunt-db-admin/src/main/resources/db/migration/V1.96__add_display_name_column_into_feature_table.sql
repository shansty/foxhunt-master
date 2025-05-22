ALTER TABLE fh_admin.feature
    ADD COLUMN display_name CHARACTER VARYING(255) COLLATE pg_catalog."default" NULL;

UPDATE fh_admin.feature SET display_name = 'Location management' WHERE name = 'LOCATION_MANAGEMENT';
UPDATE fh_admin.feature SET display_name = 'Yandex maps' WHERE name = 'YANDEX_MAPS';
UPDATE fh_admin.feature SET display_name = 'Location package management' WHERE name = 'LOCATION_PACKAGE_MANAGEMENT';
UPDATE fh_admin.feature SET display_name = 'Favorite location management' WHERE name = 'FAVORITE_LOCATION_MANAGEMENT';
UPDATE fh_admin.feature SET display_name = 'Forbidden area' WHERE name = 'FORBIDDEN_AREA';
UPDATE fh_admin.feature SET display_name = 'Help content management' WHERE name = 'HELP_CONTENT_MANAGEMENT';
UPDATE fh_admin.feature SET display_name = 'Tooltip management' WHERE name = 'TOOLTIP_MANAGEMENT';
UPDATE fh_admin.feature SET display_name = 'Competition template management' WHERE name = 'COMPETITION_TEMPLATE_MANAGEMENT';
