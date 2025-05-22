ALTER TABLE fh_admin.competition_participant ADD COLUMN start_position INT;
ALTER TABLE fh_admin.competition_participant ADD COLUMN participant_number INT;

ALTER TABLE fh_admin.competition_participant ADD PRIMARY KEY (competition_id, user_id);