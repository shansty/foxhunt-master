DROP TABLE IF EXISTS fh_admin.help_content_topic CASCADE;
CREATE TABLE fh_admin.help_content_topic
(
    help_content_topic_id BIGSERIAL PRIMARY KEY,
    title                 VARCHAR(50) NOT NULL,
    description           VARCHAR,
    is_system             BOOLEAN     NOT NULL,
    index                 BIGINT      NOT NULL
);

DROP TABLE IF EXISTS fh_admin.help_content_article CASCADE;
CREATE TABLE fh_admin.help_content_article
(
    help_content_article_id BIGSERIAL PRIMARY KEY,
    title                   VARCHAR(50) NOT NULL,
    description             VARCHAR     NOT NULL,
    index                   BIGINT      NOT NULL,
    help_content_topic_id   BIGINT REFERENCES fh_admin.help_content_topic (help_content_topic_id)
);