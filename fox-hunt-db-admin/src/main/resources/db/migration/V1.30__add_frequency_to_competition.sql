ALTER TABLE fh_admin.competition
    ADD COLUMN frequency  numeric(10, 2);
UPDATE fh_admin.competition
	SET  frequency = 144; 

ALTER TABLE fh_admin.competition
ALTER COLUMN frequency SET NOT NULL;	