ALTER TABLE fh_admin.fox_point
    ADD COLUMN frequency  numeric(10, 2) ;
	
UPDATE fh_admin.fox_point
	SET frequency=cp_query.frequency
FROM(SELECT id,frequency FROM fh_admin.competition cp) as cp_query	
WHERE competition_id = cp_query.id;

ALTER TABLE fh_admin.fox_point
ALTER COLUMN frequency SET NOT NULL;	