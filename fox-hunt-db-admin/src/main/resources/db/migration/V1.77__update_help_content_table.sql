ALTER TABLE fh_admin.help_content_topic
    DROP COLUMN description,
    ADD COLUMN notes    VARCHAR,
    ADD COLUMN contents json;


ALTER TABLE fh_admin.help_content_article
    DROP COLUMN description,
    ADD COLUMN notes    VARCHAR,
    ADD COLUMN contents json;