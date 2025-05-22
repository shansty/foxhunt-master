ALTER TABLE fh_admin.competition_participant
    ADD COLUMN finish_date timestamp without time zone;

ALTER TABLE fh_admin.competition_participant
    ADD COLUMN completed boolean DEFAULT false;