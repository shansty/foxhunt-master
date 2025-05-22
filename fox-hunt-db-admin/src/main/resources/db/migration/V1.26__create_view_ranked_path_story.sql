CREATE OR REPLACE VIEW  fh_admin.path_story_ranked  
AS 

SELECT ps.*, rank() OVER (PARTITION BY location_tracker_id ORDER BY game_time DESC) as rank
FROM  fh_admin.path_story ps;

CREATE OR REPLACE RULE "_DELETE" AS
    ON DELETE TO fh_admin.path_story_ranked
    DO INSTEAD NOTHING;