INSERT INTO fh_admin.email_template(name, subject, message)
VALUES ('Changing role notification message',
        'Foxhunt: Permission change notification',
        '<html><body><p>Hi, '||'$' || '{username}</p>'
        '<p>Your role in <b>' || '$' || '{orgName}</b> account in Foxhunt app
        (with domain ' || '$' || '{orgDomain}) was changed from <b>' || '$' || '{oldRoles}</b> to <b>' || '$' || '{updatedRoles}</b>.</p>'
        '<p>Cheers, Foxhunt!</p></body></html>');