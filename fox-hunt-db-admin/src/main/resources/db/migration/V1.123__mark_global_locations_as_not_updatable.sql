CREATE OR REPLACE FUNCTION location.f_global_locations(_organization_id_ bigint, _system_organization_id_ bigint)
    returns TABLE(organization_id bigint, location_id bigint, name character varying, is_global boolean, is_favorite boolean, is_virtual boolean, is_updatable boolean)
    language plpgsql
AS
$$
BEGIN RETURN QUERY
    SELECT _organization_id_ AS organization_id,
           l.location_id,
           l.name,
           l.is_global,
           fl.location_id IS NOT NULL AS is_favorite,
           _organization_id_ != _system_organization_id_ AS is_virtual,
           l.is_global AND _organization_id_ = _system_organization_id_ AS is_updatable
    FROM location.organization_locations ol
             INNER JOIN location.locations l ON l.location_id = ol.location_id
             LEFT JOIN location.organization_favorite_locations fl ON fl.location_id = l.location_id
        AND fl.organization_id = _organization_id_
    WHERE l.is_global = TRUE
      AND ol.organization_id = _system_organization_id_;
END
$$;
