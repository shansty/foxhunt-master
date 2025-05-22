ALTER TABLE fh_admin.competition_participant
    ADD COLUMN color character varying;
	
UPDATE fh_admin.competition_participant
	SET color='#a68064';

	