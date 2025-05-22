-- Add users
INSERT INTO fh_admin.app_user(first_name, last_name, date_of_birth, country, city, email, is_activated, password, activated_since)
VALUES
('Elena', 'Gurivets', '1998-02-01T17:25:00.000', 'Belarus', 'Minsk', 'Elena.Gurivets@foxhunt.com', TRUE, '$2a$05$GIf9TrAIbXM9ZCGx4P2.V.VNSOgOsdzT2S39SLIcLEPA6pZw8dunm', CURRENT_TIMESTAMP),
('Anton', 'Zavalski', '1995-11-01T17:25:00.000', 'Belarus', 'Minsk', 'Anton.Zavalski@foxhunt.com', TRUE, '$2a$05$GIf9TrAIbXM9ZCGx4P2.V.VNSOgOsdzT2S39SLIcLEPA6pZw8dunm', CURRENT_TIMESTAMP),
('Nikolai', 'Grushevski', '1992-03-01T17:25:00.000', 'Belarus', 'Minsk', 'Nikolai.Grushevski@foxhunt.com', TRUE, '$2a$05$GIf9TrAIbXM9ZCGx4P2.V.VNSOgOsdzT2S39SLIcLEPA6pZw8dunm', CURRENT_TIMESTAMP),
('Valentina', 'Kozachenko', '2002-06-01T17:25:00.000', 'Belarus', 'Minsk', 'Valentina.Kozachenko@foxhunt.com', TRUE, '$2a$05$GIf9TrAIbXM9ZCGx4P2.V.VNSOgOsdzT2S39SLIcLEPA6pZw8dunm', CURRENT_TIMESTAMP),
('Ilya', 'Kuzminovich', '1998-02-01T17:25:00.000', 'Belarus', 'Minsk', 'Ilya.kuzminovich@foxhunt.com', TRUE, '$2a$05$GIf9TrAIbXM9ZCGx4P2.V.VNSOgOsdzT2S39SLIcLEPA6pZw8dunm', CURRENT_TIMESTAMP),
('Boris', 'Frolov', '1993-02-01T17:25:00.000', 'Belarus', 'Minsk', 'Boris.Frolov@foxhunt.com', TRUE, '$2a$05$GIf9TrAIbXM9ZCGx4P2.V.VNSOgOsdzT2S39SLIcLEPA6pZw8dunm', CURRENT_TIMESTAMP),
('Anna', 'Grumenko', '2001-11-01T17:25:00.000', 'Belarus', 'Minsk', 'Anna.Grumenko@foxhunt.com', TRUE, '$2a$05$GIf9TrAIbXM9ZCGx4P2.V.VNSOgOsdzT2S39SLIcLEPA6pZw8dunm', CURRENT_TIMESTAMP),
('Larisa', 'Astavets', '1998-02-01T17:25:00.000', 'Belarus', 'Minsk', 'Larisa.Astavets@foxhunt.com', TRUE, '$2a$05$GIf9TrAIbXM9ZCGx4P2.V.VNSOgOsdzT2S39SLIcLEPA6pZw8dunm', CURRENT_TIMESTAMP),
('Vita', 'Simonovich', '1998-02-01T17:25:00.000', 'Belarus', 'Minsk', 'Vita.Simonovich@foxhunt.com', TRUE, '$2a$05$GIf9TrAIbXM9ZCGx4P2.V.VNSOgOsdzT2S39SLIcLEPA6pZw8dunm', CURRENT_TIMESTAMP),
('Irina', 'Veznovets', '1998-02-01T17:25:00.000', 'Belarus', 'Minsk', 'Irina.Veznovets@foxhunt.com', TRUE, '$2a$05$GIf9TrAIbXM9ZCGx4P2.V.VNSOgOsdzT2S39SLIcLEPA6pZw8dunm', CURRENT_TIMESTAMP),
('Catherine', 'Developer', '1998-02-01T17:25:00.000', 'Belarus', 'Minsk', 'Katsiaryna.hutsich@itechart-group.com', TRUE, '$2a$05$GIf9TrAIbXM9ZCGx4P2.V.VNSOgOsdzT2S39SLIcLEPA6pZw8dunm', CURRENT_TIMESTAMP),
('Alexander', 'Developer', '1998-02-01T17:25:00.000', 'Belarus', 'Minsk', 'Alexander.belyaev@itechart-group.com', TRUE, '$2a$05$GIf9TrAIbXM9ZCGx4P2.V.VNSOgOsdzT2S39SLIcLEPA6pZw8dunm', CURRENT_TIMESTAMP),
('Fyodor', 'Developer', '1998-02-01T17:25:00.000', 'Belarus', 'Minsk', 'Fiodar.Shumovich@itechart-group.com', TRUE, '$2a$05$GIf9TrAIbXM9ZCGx4P2.V.VNSOgOsdzT2S39SLIcLEPA6pZw8dunm', CURRENT_TIMESTAMP),
('Andrei', 'Developer', '1998-02-01T17:25:00.000', 'Belarus', 'Minsk', 'Andrei.Eremenko@itechart-group.com', TRUE, '$2a$05$GIf9TrAIbXM9ZCGx4P2.V.VNSOgOsdzT2S39SLIcLEPA6pZw8dunm', CURRENT_TIMESTAMP);

-- Add participants to the public domain
INSERT INTO fh_admin.organization_user_role (role_id, user_id, organization_id, is_active)
SELECT 3, app_user_id, 4, TRUE FROM fh_admin.app_user WHERE email = 'Elena.Gurivets@foxhunt.com';
INSERT INTO fh_admin.organization_user_role (role_id, user_id, organization_id, is_active)
SELECT 3, app_user_id, 4, TRUE FROM fh_admin.app_user WHERE email = 'Anton.Zavalski@foxhunt.com';
INSERT INTO fh_admin.organization_user_role (role_id, user_id, organization_id, is_active)
SELECT 3, app_user_id, 4, TRUE FROM fh_admin.app_user WHERE email = 'Nikolai.Grushevski@foxhunt.com';
INSERT INTO fh_admin.organization_user_role (role_id, user_id, organization_id, is_active)
SELECT 3, app_user_id, 4, TRUE FROM fh_admin.app_user WHERE email = 'Valentina.Kozachenko@foxhunt.com';
INSERT INTO fh_admin.organization_user_role (role_id, user_id, organization_id, is_active)
SELECT 3, app_user_id, 4, TRUE FROM fh_admin.app_user WHERE email = 'Ilya.kuzminovich@foxhunt.com';
--Add participants to the pravda domain
INSERT INTO fh_admin.organization_user_role (role_id, user_id, organization_id, is_active)
SELECT 3, app_user_id, 1, TRUE FROM fh_admin.app_user WHERE email = 'Boris.Frolov@foxhunt.com';
INSERT INTO fh_admin.organization_user_role (role_id, user_id, organization_id, is_active)
SELECT 3, app_user_id, 1, TRUE FROM fh_admin.app_user WHERE email = 'Anna.Grumenko@foxhunt.com';
INSERT INTO fh_admin.organization_user_role (role_id, user_id, organization_id, is_active)
SELECT 3, app_user_id, 1, TRUE FROM fh_admin.app_user WHERE email = 'Larisa.Astavets@foxhunt.com';
INSERT INTO fh_admin.organization_user_role (role_id, user_id, organization_id, is_active)
SELECT 3, app_user_id, 1, TRUE FROM fh_admin.app_user WHERE email = 'Vita.Simonovich@foxhunt.com';
INSERT INTO fh_admin.organization_user_role (role_id, user_id, organization_id, is_active)
SELECT 3, app_user_id, 1, TRUE FROM fh_admin.app_user WHERE email = 'Irina.Veznovets@foxhunt.com';
--Add developer users to pravda and public domains
INSERT INTO fh_admin.organization_user_role (role_id, user_id, organization_id, is_active)
SELECT 1, app_user_id, 1, TRUE FROM fh_admin.app_user WHERE email = 'Katsiaryna.hutsich@itechart-group.com';
INSERT INTO fh_admin.organization_user_role (role_id, user_id, organization_id, is_active)
SELECT 1, app_user_id, 4, TRUE FROM fh_admin.app_user WHERE email = 'Katsiaryna.hutsich@itechart-group.com';
INSERT INTO fh_admin.organization_user_role (role_id, user_id, organization_id, is_active)
SELECT 1, app_user_id, 1, TRUE FROM fh_admin.app_user WHERE email = 'Alexander.belyaev@itechart-group.com';
INSERT INTO fh_admin.organization_user_role (role_id, user_id, organization_id, is_active)
SELECT 1, app_user_id, 4, TRUE FROM fh_admin.app_user WHERE email = 'Alexander.belyaev@itechart-group.com';
INSERT INTO fh_admin.organization_user_role (role_id, user_id, organization_id, is_active)
SELECT 1, app_user_id, 1, TRUE FROM fh_admin.app_user WHERE email = 'Fiodar.Shumovich@itechart-group.com';
INSERT INTO fh_admin.organization_user_role (role_id, user_id, organization_id, is_active)
SELECT 1, app_user_id, 4, TRUE FROM fh_admin.app_user WHERE email = 'Fiodar.Shumovich@itechart-group.com';
INSERT INTO fh_admin.organization_user_role (role_id, user_id, organization_id, is_active)
SELECT 1, app_user_id, 1, TRUE FROM fh_admin.app_user WHERE email = 'Andrei.Eremenko@itechart-group.com';
INSERT INTO fh_admin.organization_user_role (role_id, user_id, organization_id, is_active)
SELECT 1, app_user_id, 4, TRUE FROM fh_admin.app_user WHERE email = 'Andrei.Eremenko@itechart-group.com';