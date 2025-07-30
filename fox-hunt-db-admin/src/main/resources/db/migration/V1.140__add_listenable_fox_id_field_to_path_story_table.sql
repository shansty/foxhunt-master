ALTER TABLE fh_admin.path_story
ADD COLUMN listenable_fox_id BIGINT REFERENCES fh_admin.fox_point(fox_point_id);