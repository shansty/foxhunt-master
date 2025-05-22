import { get } from 'lodash';

export const convertPointToCoordinates = (point) =>
  get(point, ['coordinates'], []);

export const convertPolygonToCoordinates = (polygon) =>
  get(polygon, ['coordinates', 0], []);

export const convertFoxPointsToCoordinates = (foxPoints) =>
  Array.isArray(foxPoints)
    ? foxPoints.map((foxPoint) => ({
        ...foxPoint,
        coordinates: convertPointToCoordinates(foxPoint.coordinates),
      }))
    : null;

export const convertCoordinatesToPoint = (coordinates) =>
  Array.isArray(coordinates) ? { type: 'Point', coordinates } : null;

export const convertCoordinatesToPolygon = (coordinates) =>
  Array.isArray(coordinates)
    ? { type: 'Polygon', coordinates: [coordinates] }
    : null;

export const convertCoordinatesToFoxPoints = (foxPoints) =>
  Array.isArray(foxPoints)
    ? foxPoints.map((foxPoint) => ({
        ...foxPoint,
        coordinates: convertCoordinatesToPoint(foxPoint.coordinates),
      }))
    : null;

export const convertCoordinatesToForbiddenAreas = (forbiddenAreas) =>
  Array.isArray(forbiddenAreas)
    ? forbiddenAreas.map((forbiddenArea) => ({
        coordinates: convertCoordinatesToPolygon(forbiddenArea.polygon),
      }))
    : null;

export const convertForbiddenAreasToCoordinates = (forbiddenAreas) =>
  Array.isArray(forbiddenAreas)
    ? forbiddenAreas.map((forbiddenArea) => ({
        id: forbiddenArea.id,
        polygon: convertPolygonToCoordinates(forbiddenArea.coordinates),
      }))
    : null;

export const convertToLocationForRequest = (location) => ({
  ...location,
  center: convertCoordinatesToPoint(location.center),
  coordinates: convertCoordinatesToPolygon(location.coordinates),
  forbiddenAreas: convertCoordinatesToForbiddenAreas(location.forbiddenAreas),
});

export const convertToLocationFromResponse = (location) => ({
  ...location,
  center: convertPointToCoordinates(location.center),
  coordinates: convertPolygonToCoordinates(location.coordinates),
  forbiddenAreas: convertForbiddenAreasToCoordinates(location.forbiddenAreas),
});

export const convertToLocationArrayFromResponse = (locations) =>
  locations.map((location) => convertToLocationFromResponse(location));

export const convertToCompetitionForRequest = (competition) => ({
  ...competition,
  startPoint: convertCoordinatesToPoint(competition.startPoint),
  finishPoint: convertCoordinatesToPoint(competition.finishPoint),
  foxPoints: convertCoordinatesToFoxPoints(competition.foxPoints),
  location: convertToLocationForRequest(competition.location),
});

export const convertToCompetitionFromResponse = (competition) => ({
  ...competition,
  startPoint: convertPointToCoordinates(competition.startPoint),
  finishPoint: convertPointToCoordinates(competition.finishPoint),
  foxPoints: convertFoxPointsToCoordinates(competition.foxPoints),
  location: convertToLocationFromResponse(competition.location),
});

export const convertToCompetitionArrayFromResponse = (competitions) =>
  competitions.map((competition) =>
    convertToCompetitionFromResponse(competition),
  );

export const convertToLocationPackageForRequest = (locationPackage) => ({
  ...locationPackage,
  center: convertCoordinatesToPoint(locationPackage.center),
  coordinates: convertCoordinatesToPolygon(locationPackage.coordinates),
  locations: locationPackage.locations.map((location) =>
    convertToLocationForRequest(location),
  ),
});

export const convertToLocationPackageFromResponse = (locationPackage) => ({
  ...locationPackage,
  center: convertPointToCoordinates(locationPackage.center),
  coordinates: convertPolygonToCoordinates(locationPackage.coordinates),
  locations: locationPackage.locations.map((location) =>
    convertToLocationFromResponse(location),
  ),
});

export const convertToLocationPackageArrayFromResponse = (locationPackages) =>
  locationPackages.map((locationPackage) =>
    convertToLocationPackageFromResponse(locationPackage),
  );
