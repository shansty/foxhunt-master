import {
  DEGREE_180,
  DEGREE_360,
  LATITUDE_INDEX,
  LONGITUDE_INDEX,
  PI_NUMBER,
  TWO_FRACTION_DIGITS,
} from '../constants/commonConstants';

const calculateAngleToPoint = (userLocation, heading, currentFox) => {
  let theta = Math.atan2(
    currentFox.coordinates.coordinates[LONGITUDE_INDEX] - userLocation.longitude,
    currentFox.coordinates.coordinates[LATITUDE_INDEX] - userLocation.latitude,
  );
  if (theta < 0.0) {
    theta += 2 * PI_NUMBER;
  }
  const angleNorthPoint = DEGREE_180/PI_NUMBER * theta;
  let angleToPoint = +Math.abs(angleNorthPoint - heading).toFixed(TWO_FRACTION_DIGITS);
  if (angleToPoint > DEGREE_180) {
    angleToPoint = DEGREE_360 - angleToPoint;
  }
  return angleToPoint;
};

export default calculateAngleToPoint;
