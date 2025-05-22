ALTER TABLE fh_admin.user_invitation
ADD COLUMN email_template_id BIGSERIAL REFERENCES fh_admin.email_template(email_template_id) NOT NULL;
