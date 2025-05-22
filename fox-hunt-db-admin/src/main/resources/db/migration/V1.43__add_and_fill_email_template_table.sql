DROP TABLE IF EXISTS fh_admin.email_template CASCADE;
CREATE TABLE fh_admin.email_template (
    email_template_id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    subject VARCHAR(50),
    message TEXT
);

INSERT INTO fh_admin.email_template(name, subject, message) VALUES (
    'User invitation message',
    'Welcome to FoxHunt!',
    '<html><head></head><body><p>Hello,</p><p>You''ve been invited to join ' ||'$' || '{orgName} account in Foxhunt app.
    You could <a href=''' ||'$' || '{acceptLink}''>accept</a> or <a href=''' ||'$' || '{declineLink}''>decline</a> the invitation
    The invitation expires in 24 hours</p></body></html>'
);

