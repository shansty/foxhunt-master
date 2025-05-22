INSERT INTO fh_admin.email_template(name, subject, message)
VALUES ('New participant invitation message',
        'Welcome to FoxHunt!',
        '<html><head></head><body><p>Hello,</p><p>You''ve been invited to join ' || '$' ||
        '{orgName} account in Foxhunt app (with domain ' || '$' ||
        '{orgDomain}) as a competitor! ' ||
        'Your initial login is ' || '$' || '{username} and password is ' || '$' || '{password}
        </p></body></html>');

INSERT INTO fh_admin.email_template(name, subject, message)
VALUES ('Participant invitation message',
        'Welcome to FoxHunt!',
        '<html><head></head><body><p>Hello,</p><p>You''ve been invited to join ' || '$' ||
        '{orgName} account in Foxhunt app (with domain ' || '$' || '{orgDomain}) as a competitor!
        </p></body></html>');

UPDATE fh_admin.email_template
SET message = '<html><head></head><body><p>Hello,</p><p>You''ve been invited to join ' || '$' || '{orgName} account in Foxhunt app (with domain ' || '$' || '{orgDomain}) as a trainer!
    You could <a href=''' || '$' || '{acceptLink}''>accept</a> or <a href=''' || '$' || '{declineLink}''>decline</a> the invitation
    The invitation expires in 24 hours</p></body></html>'
WHERE name = 'Trainer invitation message';

UPDATE fh_admin.email_template
SET message = '<html><head></head><body><p>Hello,</p><p>You''ve been invited to join ' || '$' || '{orgName} account in Foxhunt app (with domain ' || '$' || '{orgDomain}).
    You could <a href=''' || '$' || '{acceptLink}''>accept</a> or <a href=''' || '$' || '{declineLink}''>decline</a> the invitation
    The invitation expires in 24 hours</p></body></html>'
WHERE name = 'Organization admin invitation message';

