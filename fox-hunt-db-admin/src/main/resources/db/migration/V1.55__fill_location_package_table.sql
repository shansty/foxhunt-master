INSERT INTO fh_admin.location_package (name, zoom, creation_date, update_date, center,
                                       coordinates, type, created_by)
VALUES ('Zelyonoe', 10, '2020-01-03T09:59:00.000', '2020-02-03T14:11:00.000',
        'POINT (53.907 27.567)',
        'POLYGON ((
        54.07229554285454 27.130980102539045,
        53.75691714730715 27.129606811523423,
        53.74305081960616 28.037159230291724,
        54.074689591900025 28.02891948419799,
        54.07229554285454 27.130980102539045))', 'SYSTEM', 1);

INSERT INTO fh_admin.location_package_location (location_package_id, location_id)
VALUES (1, 4),
       (1, 5),
       (1, 6);
