CREATE OR REPLACE FUNCTION location.f_is_within_earth_coordinates(_location_ geometry)
    RETURNS TABLE
            (
                is_valid boolean
            )
    LANGUAGE PLPGSQL
AS
$func$
BEGIN
    RETURN QUERY
        SELECT * FROM ST_Within(_location_,
            ST_GeomFromText('POLYGON((-179.9 -85,-179.9 85, 180 85, 180 -85,-179.9 -85))')) AS is_valid;
END
$func$;