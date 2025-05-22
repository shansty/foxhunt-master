INSERT INTO fh_admin.email_template(name, subject, message)
VALUES ('Trainer and Participant invitation message',
        'Welcome to FoxHunt!',
        '<html><body><p>Hello,</p><p>You''ve been invited to join ' || '$' || '{orgName} account in Foxhunt app
        (with domain ' || '$' || '{orgDomain}) as a trainer and a participant! You could
        <a href=''' || '$' || '{acceptLink}''>accept</a> or <a href=''' || '$' || '{declineLink}''>decline</a>
        the invitation within in 24 hours.</p></body></html>');