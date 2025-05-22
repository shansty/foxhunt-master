ALTER TABLE fh_admin.path_story
    ADD COLUMN IF NOT EXISTS is_disconnected BOOLEAN DEFAULT false;