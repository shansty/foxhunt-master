ALTER TABLE fh_admin.competition
    ADD COLUMN fox_range INT NOT NULL DEFAULT 3000
        CHECK (fox_range >= 10);