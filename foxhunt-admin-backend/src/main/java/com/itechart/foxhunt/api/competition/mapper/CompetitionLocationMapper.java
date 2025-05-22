package com.itechart.foxhunt.api.competition.mapper;

import com.itechart.foxhunt.api.location.dto.ForbiddenArea;
import com.itechart.foxhunt.api.location.dto.LocationFullDto;
import com.itechart.foxhunt.domain.entity.CompetitionLocation;
import com.itechart.foxhunt.domain.entity.ForbiddenAreaEntity;
import com.itechart.foxhunt.domain.entity.location.LocationEntity;
import org.locationtech.jts.geom.Polygon;
import org.mapstruct.Mapper;

@Mapper
public interface CompetitionLocationMapper {

    CompetitionLocation entityToCompetitionLocation(LocationEntity locationEntity);

    CompetitionLocation domainToCompetitionLocation(LocationFullDto locationFullDto);

    LocationFullDto competitionLocationToDomain(CompetitionLocation competitionLocation);

    default Polygon entityToPolygon(ForbiddenAreaEntity forbiddenAreaEntity) {
        return forbiddenAreaEntity.getCoordinates();
    }

    default ForbiddenAreaEntity polygonToEntity(Polygon areaPolygon) {
        ForbiddenAreaEntity forbiddenAreaEntity = new ForbiddenAreaEntity();
        forbiddenAreaEntity.setCoordinates(areaPolygon);
        return forbiddenAreaEntity;
    }

    default Polygon domainToPolygon(ForbiddenArea forbiddenArea) {
        return forbiddenArea.getCoordinates();
    }

    default ForbiddenArea polygonToDomain(Polygon areaPolygon) {
        ForbiddenArea forbiddenArea = new ForbiddenArea();
        forbiddenArea.setCoordinates(areaPolygon);
        return forbiddenArea;
    }

}
