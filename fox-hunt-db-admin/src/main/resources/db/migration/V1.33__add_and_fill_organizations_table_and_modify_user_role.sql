-- Introduce organizations table

DROP TYPE IF EXISTS ORGANIZATION_TYPE;
CREATE TYPE ORGANIZATION_TYPE AS ENUM ('FREE', 'PAID');

DROP TABLE IF EXISTS fh_admin.organizations CASCADE;
CREATE TABLE fh_admin.organizations
(
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    legal_address VARCHAR(255) NOT NULL,
    actual_address VARCHAR(255),
    org_domain VARCHAR(50) UNIQUE NOT NULL,
    root_user_id INT REFERENCES fh_admin.app_user(id) NOT NULL,
    contact_email VARCHAR(50) NOT NULL,
    type ORGANIZATION_TYPE NOT NULL,
    approximate_employees_amount INT
);

-- Update role table and insert new roles

UPDATE fh_admin.role SET role='TRAINER' WHERE role = 'COACH';
INSERT INTO fh_admin.role(id, role) VALUES (4, 'ORGANIZATION_ADMIN');
INSERT INTO fh_admin.role(id ,role) VALUES (5, 'SYSTEM_ADMIN');

-- Modify user_role table

ALTER TABLE fh_admin.user_role RENAME TO organization_user_role;
ALTER TABLE fh_admin.organization_user_role ADD COLUMN organization_id INT REFERENCES fh_admin.organizations(organization_id);

-- Organizations with admins insertions, assign roles to created admins

WITH john_id(user_id) AS (INSERT INTO fh_admin.app_user(first_name, last_name, date_of_birth, country, city, email, is_activated)
                     VALUES ('John', 'Doe', null, null, null, 'radioschooladmin@mail.com', true) RETURNING id),
     john_org(organization_id) AS (INSERT INTO fh_admin.organizations(name, legal_address, actual_address, org_domain, root_user_id, contact_email, type, approximate_employees_amount)
         VALUES ('Radio School', 'ul.Pravdy 5', 'ul.Niepravdy 10', 'pravda', (SELECT user_id FROM john_id), 'radioschoolcontact@mail.com', 'FREE', 10) RETURNING organization_id)

INSERT INTO fh_admin.organization_user_role (role_id, user_id, organization_id)
VALUES ((SELECT id FROM fh_admin.role WHERE role='ORGANIZATION_ADMIN'), (SELECT user_id FROM john_id), (SELECT organization_id FROM john_org));

WITH eric_id(user_id) AS (INSERT INTO fh_admin.app_user(first_name, last_name, date_of_birth, country, city, email, is_activated)
                     VALUES ('Eric', 'Cartman', null, null, null, 'bestteam@mail.com', true) RETURNING id),
     eric_org(organization_id) AS (INSERT INTO fh_admin.organizations(name, legal_address, actual_address, org_domain, root_user_id, contact_email, type, approximate_employees_amount)
         VALUES ('Best Team', '221 White Causeway, Apt. 940, 89988, North Pete, Rhode Island, United States', '35305 Alanis Path, Suite 580, 92044, Ismaelmouth, Pennsylvania, United States', 'bestteam', (SELECT user_id FROM eric_id), 'bestteamcontact@mail.com', 'PAID', 75) RETURNING organization_id)

INSERT INTO fh_admin.organization_user_role (role_id, user_id, organization_id)
VALUES ((SELECT id FROM fh_admin.role WHERE role='ORGANIZATION_ADMIN'), (SELECT user_id FROM eric_id), (SELECT organization_id FROM eric_org));


WITH lord_id(user_id) AS (INSERT INTO fh_admin.app_user(first_name, last_name, date_of_birth, country, city, email, is_activated)
                     VALUES ('Star', 'Lord', null, null, null, 'starlord@mail.com', true) RETURNING id),
     lord_org(organization_id) AS (INSERT INTO fh_admin.organizations(name, legal_address, actual_address, org_domain, root_user_id, contact_email, type, approximate_employees_amount)
         VALUES ('SomeName', '0205 Raymond Valleys, Apt. 349', '530 Erica Row, Apt. 112', 'somedomain', (SELECT user_id FROM lord_id), 'somecontactemail@mail.com', 'FREE', 10) RETURNING organization_id)

INSERT INTO fh_admin.organization_user_role (role_id, user_id, organization_id)
VALUES ((SELECT id FROM fh_admin.role WHERE role='ORGANIZATION_ADMIN'), (SELECT user_id FROM lord_id), (SELECT organization_id FROM lord_org));

-- Add some users to organizations

UPDATE fh_admin.organization_user_role SET organization_id = 1 WHERE user_id BETWEEN 0 AND 3;
UPDATE fh_admin.organization_user_role SET organization_id = 2 WHERE user_id BETWEEN 4 AND 8;
UPDATE fh_admin.organization_user_role SET organization_id = 3 WHERE user_id BETWEEN 9 AND 11;