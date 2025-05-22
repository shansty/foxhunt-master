import _ from 'lodash';
import dayjs from 'dayjs';
import { getPathLength } from 'geolib';
import { compare } from 'color-difference';

import { compareByNumber } from 'src/utils';
import {
  COMPARE_COLOR_VALUE,
  COMPARE_COLOR_VALUE_MAX,
  STROKE_COLORS,
} from 'src/constants/mapConst';
export { PointsMap } from './PointsMap';

export const getParticipantName = (participant) =>
  `${participant.firstName} ${participant.lastName}`;

export const getStartPairs = (participants = []) =>
  participants.reduce((acc, participant, index) => {
    if (participant.lastName === null) {
      participant.lastName = '';
    }
    const participantIndex = ++index;
    if (participantIndex % 2 !== 0) {
      return [
        ...acc,
        {
          draggableId: acc.length + 1,
          position: acc.length + 1,
          participant1: {
            id: participant.id,
            name: getParticipantName(participant),
          },
        },
      ];
    } else {
      const incompletePair = {
        ...acc.pop(),
        participant2: {
          id: participant.id,
          name: getParticipantName(participant),
        },
      };
      return [...acc, incompletePair];
    }
  }, []);

// Eliminates objects for the "DragDropTableRow" component to render start pairs
export const convertStartPairsForRender = (startPairs) =>
  Array.isArray(startPairs)
    ? startPairs.map(({ participant1, participant2, ...startPair }) => ({
        ...startPair,
        participant1: participant1.name,
        participant2: _.get(participant2, ['name'], ''),
      }))
    : [];

const getStartParticipantsMap = (startPairs, competition) => {
  const colors = Object.values(STROKE_COLORS);
  const { foxAmount, startDate: competitionStart } = competition;
  const startParticipantsMap = new Map();
  const cycleInterval = foxAmount + 1;
  let participantNumber = 0;
  startPairs.forEach(
    ({ position: pairPosition, participant1, participant2 }) => {
      const plusMinutes =
        pairPosition === 1 ? 1 : 1 + (pairPosition - 1) * cycleInterval;
      const startDate = dayjs(competitionStart).add(plusMinutes, 'minute');
      [participant1, participant2].forEach((participant) => {
        if (participant) {
          const color = createUniqueColor(colors);
          colors.push(color);
          startParticipantsMap.set(participant.id, {
            color,
            pairPosition,
            participantNumber: ++participantNumber,
            startDate,
          });
        }
      });
    },
  );
  return startParticipantsMap;
};

export const getStartParticipants = (startPairs, competition) => {
  const { participants } = competition;
  const startParticipantsMap = getStartParticipantsMap(startPairs, competition);
  if (startParticipantsMap.size) {
    return participants
      .map((participant) => {
        const { pairPosition, startDate, participantNumber } =
          startParticipantsMap.get(participant.id);
        return {
          color: generateRandomColor(),
          pairPosition,
          participantNumber,
          startDate,
          ...participant,
        };
      })
      .sort(compareByNumber({ identity: 'participantNumber' }));
  }
  return [];
};

export const generatePoint = (bounds) => {
  if (Array.isArray(bounds) && bounds.length === 2) {
    const yMin = bounds[0][0];
    const yMax = bounds[1][0];
    const xMin = bounds[0][1];
    const xMax = bounds[1][1];
    const lat = yMin + Math.random() * (yMax - yMin);
    const lng = xMin + Math.random() * (xMax - xMin);
    return [lat, lng];
  }
  return null;
};

export const getCompetitionDistance = (
  startPoint,
  finishPoint,
  foxPoints = {},
) => {
  if (!startPoint || !finishPoint) {
    return 0;
  }

  return getPathLength(
    createGeoPointsArray(startPoint, finishPoint, foxPoints),
  );
};

export const createGeoPointsArray = (
  startPoint,
  finishPoint,
  foxPoints = {},
) => {
  const points = [];
  points.push(convertToGeoLibPoint(startPoint));

  Object.keys(foxPoints).forEach((key) => {
    const foxPoint = foxPoints[key];
    points.push(convertToGeoLibPoint(foxPoint.coordinates));
  });

  points.push(convertToGeoLibPoint(finishPoint));
  return points;
};

export const convertToGeoLibPoint = (coordinatesArr) => ({
  latitude: coordinatesArr[0],
  longitude: coordinatesArr[1],
});

export const generateFoxFrequency = (competitionFrequency) => {
  // random int between -10 and 10
  const distribution = Math.round((2 * Math.random() - 1) * 10);
  return competitionFrequency + distribution / 100;
};

export const generateRandomColor = () => {
  const numberOfRgbColors = 16777215;
  const targetLength = 6;
  const randomColor = Math.floor(Math.random() * numberOfRgbColors)
    .toString(16)
    .padStart(targetLength, '0');
  return `#${randomColor}`;
};

export const createUniqueColor = (arr) => {
  let color;
  const value = arr.length < 20 ? COMPARE_COLOR_VALUE : COMPARE_COLOR_VALUE_MAX;

  do {
    color = generateRandomColor();
  } while (arr.some((item) => compare(item, color) < value));

  return color;
};
