ALTER TABLE fh_admin.competition
    ADD COLUMN cancellation_reason CHARACTER VARYING(200) COLLATE pg_catalog."default";
ALTER TABLE fh_admin.competition
    RENAME COLUMN reason_to_stop TO stopping_reason;
