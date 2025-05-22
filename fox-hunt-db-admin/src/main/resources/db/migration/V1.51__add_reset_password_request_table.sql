DROP TYPE IF EXISTS fh_admin.reset_password_request_status CASCADE;
CREATE TYPE fh_admin.reset_password_request_status AS ENUM (
	'NEW', 'ACCEPTED', 'EXPIRED', 'INVALID'
);

DROP TABLE IF EXISTS fh_admin.reset_password_request CASCADE;
CREATE TABLE fh_admin.reset_password_request (
    reset_password_request_id BIGSERIAL PRIMARY KEY,
    user_email VARCHAR(50) NOT NULL,
    request_date TIMESTAMP NOT NULL,
    expiration_date TIMESTAMP,
    reset_date TIMESTAMP,
    token VARCHAR(50),
    status fh_admin.reset_password_request_status DEFAULT 'NEW',
    is_user_existed BOOLEAN DEFAULT FALSE,
    email_template_id BIGSERIAL REFERENCES fh_admin.email_template(email_template_id) NOT NULL
);

INSERT INTO fh_admin.email_template(name, subject, message) VALUES (
    'Reset password for non-existing user',
    'Reset password request for Foxhunt',
    '<html><head></head><body><p>Hello, </p>
    <p>You (or someone else) entered this email when trying to reset password from a Foxhunt account.
    However, we don''t have this email in the list of our registered users.
    If you''re a Foxhunt user and were expecting this email, please use the email address you specified during registration.
    If you didn''t send this request - please ignore the email.</p>
    <p>Cheers, Foxhunt!</p></body></html>'
);

INSERT INTO fh_admin.email_template(name, subject, message) VALUES (
    'Reset password for existing user without password',
    'Reset password request for Foxhunt ',
    '<html><head></head><body><p>Hi, '||'$' || '{username}</p>
    <p>You''ve recently asked to reset the password for your Foxhunt account.
    Since you''ve selected Google as a main sign in method, you never had a custom password to Foxhunt.
    Try to use Sign In with Google instead. If you forgot password from Google account, then you need to reset it in Google.</p>
    <p>If you didn''t send such a request - please ignore the email.</p>
    <p>Cheers, Foxhunt!</p></body></html>'
);

INSERT INTO fh_admin.email_template(name, subject, message) VALUES (
    'Reset password for existing user with password',
    'Reset your Foxhunt password',
    '<html><head></head><body><p>Hi, '||'$' || '{username}</p>
    <p>You''ve recently asked to reset the password for your Foxhunt account.
    To update your password, click the the following <a href=''' || '$' || '{resetPasswordLink}''>reset-link</a>.
    The link is valid for 24 hours.</p>
    <p>If you didn''t send such a request - please ignore the email.</p>
    <p>Cheers, Foxhunt!</p></body></html>'
);

ALTER TABLE fh_admin.user_invitation ADD COLUMN transition_date TIMESTAMP;
