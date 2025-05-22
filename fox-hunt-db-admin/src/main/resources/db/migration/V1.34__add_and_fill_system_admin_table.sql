DROP TABLE IF EXISTS fh_admin.system_admin CASCADE;
CREATE TABLE fh_admin.system_admin
(
    system_admin_id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(100) NOT NULL
);

INSERT INTO fh_admin.system_admin(first_name, last_name, email, password)
VALUES ('Alexander', 'Belyaev', 'Alexander.Belyaev@itechart-group.com', '$2a$05$GIf9TrAIbXM9ZCGx4P2.V.VNSOgOsdzT2S39SLIcLEPA6pZw8dunm')
