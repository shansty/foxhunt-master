import {
  DEFAULT_EDGES_AMOUNT,
  DEFAULT_USER_RADIUS_FOR_SINGLE_COMPETITIONS,
  LATITUDE_INDEX,
  LONGITUDE_INDEX,
  SECONDS_IN_MINUTE,
  TWO_FRACTION_DIGITS,
  ZERO_FRACTION_DIGITS,
} from './constants/commonConstants';
import {
  circleToPolygonConverter,
  randomPointsInsidePolygonGenerator,
} from './mapUtils';

const FREQUENCY_DEDUCTION_COEFFICIENT = 0.1;
const FREQUENCY_MULTIPLIER_COEFFICIENT = 0.002;
const FREQUENCY_GENERATOR_DIVIDE_COEFFICIENT = 100;
const FREQUENCY_GENERATOR_SUBTRACT_COEFFICIENT = 1;
const FREQUENCY_GENERATOR_FIRST_MULTIPLE_COEFFICIENT = 2;
const FREQUENCY_GENERATOR_SECOND_MULTIPLE_COEFFICIENT = 10;
const INDEX_MULTIPLIER_COEFFICIENT = 119;

export const calculateFrequency = (frequency, competitionFrequency) =>
  Number((frequency * FREQUENCY_MULTIPLIER_COEFFICIENT +
    competitionFrequency - FREQUENCY_DEDUCTION_COEFFICIENT).toFixed(TWO_FRACTION_DIGITS));

export const calculateVolume = (volume) => Number(volume.toFixed(ZERO_FRACTION_DIGITS));

export const generateFoxFrequency = (competitionFrequency) =>
  competitionFrequency + Math.round((FREQUENCY_GENERATOR_FIRST_MULTIPLE_COEFFICIENT *
    Math.random() - FREQUENCY_GENERATOR_SUBTRACT_COEFFICIENT) *
    FREQUENCY_GENERATOR_SECOND_MULTIPLE_COEFFICIENT) / FREQUENCY_GENERATOR_DIVIDE_COEFFICIENT;

export const buildFoxPoints = (foxAmount, polygon, frequency) => {
  const randomPointsCoordinates = randomPointsInsidePolygonGenerator(
    foxAmount,
    polygon,
  );
  return randomPointsCoordinates.map((pointLocation, index) => ({
    index: index + 1,
    id: INDEX_MULTIPLIER_COEFFICIENT * (index + 1),
    coordinates: pointLocation,
    frequency: generateFoxFrequency(frequency),
    isFound: false,
    catchingArea: circleToPolygonConverter(
      [
        pointLocation.coordinates[LONGITUDE_INDEX],
        pointLocation.coordinates[LATITUDE_INDEX],
      ],
      DEFAULT_USER_RADIUS_FOR_SINGLE_COMPETITIONS,
      DEFAULT_EDGES_AMOUNT,
    ),
  }));
};

export const initializeCompetitionInfo = (competition) => {
  const startUserLocation = competition.startUserLocation;
  const polygon = circleToPolygonConverter(
    [startUserLocation.coords.longitude, startUserLocation.coords.latitude],
    competition.area / 2,
    DEFAULT_EDGES_AMOUNT,
  );
  const pointsPolygon = circleToPolygonConverter(
    [startUserLocation.coords.longitude, startUserLocation.coords.latitude],
    (competition.area / 2) - DEFAULT_USER_RADIUS_FOR_SINGLE_COMPETITIONS,
    DEFAULT_EDGES_AMOUNT,
  );
  const foxPoints = buildFoxPoints(competition.foxAmount, pointsPolygon, competition.frequency);
  return {
    ...competition,
    center: {
      latitude: startUserLocation.coords.latitude,
      longitude: startUserLocation.coords.longitude,
    },
    polygon: polygon,
    foxPoints: foxPoints,
    duration: competition.duration * SECONDS_IN_MINUTE,
  };
};
