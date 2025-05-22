ALTER TABLE fh_admin.fox_point
    ADD CONSTRAINT unique_index_competition UNIQUE (competition_id, index);

