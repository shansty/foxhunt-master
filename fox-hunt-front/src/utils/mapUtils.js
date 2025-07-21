import {
  getAllParticipantMarkerProps,
  getFinishMarkerProps,
  getFoxMarkerProps,
  getStartMarkerProps,
} from './markers';
import { find, get } from 'lodash';
import { DEFAULT_CENTER_COORDINATES } from 'src/constants/mapConst';

const getFoxPointsProps = (foxPoints = [], activeFoxIndex, foxRange, isFoxRangeEnabled = true) =>
  foxPoints.map(({ id, label, coordinates, circleCenter, index, frequency }) =>
    getFoxMarkerProps({
      coordinates,
      circleCenter,
      label,
      id,
      isActive: index === activeFoxIndex,
      frequency,
      foxRange,
      isFoxRangeVisible: isFoxRangeEnabled, 
    }),
  );

export const getPointsProps = (
  competition,
  activeFoxIndex,
  participantTrackers = [],
  isFoxRangeEnabled = true,
) => {
  const pointsProps = [];
  const { startPoint, finishPoint, foxPoints, foxRange } = competition;
  if (startPoint && startPoint.length)
    pointsProps.push(getStartMarkerProps({ coordinates: startPoint }));
  if (finishPoint && finishPoint.length)
    pointsProps.push(getFinishMarkerProps({ coordinates: finishPoint }));

  if (participantTrackers.length > 0) {
    const participantInfoTrackers = populateParticipantInfoForTrackers(
      competition,
      participantTrackers,
    );
    const participantmarkers = getAllParticipantMarkerProps(
      participantInfoTrackers,
    );
    participantmarkers.forEach((participant) => pointsProps.push(participant));
  }

  return getFoxPointsProps(foxPoints, activeFoxIndex, foxRange, isFoxRangeEnabled).concat(
    pointsProps,
  );
};

export const populateParticipantInfoForTrackers = (
  competition = {},
  participantTrackers = [],
) => {
  const participants = get(competition, 'participants', []);

  return participantTrackers.map((participantTracker) => {
    const participant = find(participants, [
      'id',
      participantTracker.participantId,
    ]);
    return Object.assign({}, participantTracker, { participant });
  });
};

export const getMapCenterCoordinates = (geometryCenter) => {
  const { coordinates } = geometryCenter;
  return Array.isArray(coordinates) && coordinates.length
    ? coordinates
    : DEFAULT_CENTER_COORDINATES;
};
