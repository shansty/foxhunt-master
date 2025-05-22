UPDATE fh_admin.email_template SET name = 'Organization admin invitation message' WHERE name = 'User invitation message';

INSERT INTO fh_admin.email_template(name, subject, message) VALUES (
    'Trainer invitation message',
    'Welcome to FoxHunt!',
    '<html><head></head><body><p>Hello,</p><p>You''ve been invited to join ' ||'$' || '{orgName} account in Foxhunt app as a trainer!
    You could <a href=''' ||'$' || '{acceptLink}''>accept</a> or <a href=''' ||'$' || '{declineLink}''>decline</a> the invitation
    The invitation expires in 24 hours</p></body></html>'
);

