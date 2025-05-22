import circleToPolygon from 'circle-to-polygon';
import randomPointsOnPolygon from 'random-points-on-polygon';
import turf from 'turf';
import {
  LATITUDE_INDEX,
  LONGITUDE_INDEX,
  ZERO_FRACTION_DIGITS,
} from './constants/commonConstants';

export const circleToPolygonConverter = (coordinates, radius, edgesAmount) => {
  const polygon = circleToPolygon(coordinates, radius, edgesAmount);
  const revertCoordinates = polygon.coordinates[0]
    .map((coordinate) => [coordinate[LONGITUDE_INDEX], coordinate[LATITUDE_INDEX]]);
  return {
    ...polygon,
    coordinates: [revertCoordinates],
  };
};

export const randomPointsInsidePolygonGenerator = (numberOfPoints, polygon) => {
  const polygonFromPoints = turf.polygon(polygon.coordinates);
  const randomPoints = randomPointsOnPolygon(numberOfPoints, polygonFromPoints);
  return randomPoints.map((point) => point.geometry);
};

export const isPointInsidePolygon = (latitude, longitude, polygonGeometry) => {
  const point = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Point',
      coordinates: [latitude, longitude],
    },
  };
  const polygon = {
    type: 'Feature',
    properties: {},
    geometry: polygonGeometry,
  };
  return turf.inside(point, polygon);
};

export const distanceBetweenTwoPoints = (from, to, units) => {
  if (from && to) {
    const fromPoint = turf.point(from);
    const toPoint = turf.point(to);
    return (turf.distance(fromPoint, toPoint, 'kilometers') * units).toFixed(ZERO_FRACTION_DIGITS);
  } else {
    return null;
  }
};
