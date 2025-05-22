import { useMemo, useCallback } from 'react';

import { getColorConfig } from 'src/utils/index';

export default function useParticipantTracerLines(
  competition,
  participantTrackers,
) {
  const convertToTracerLines = useCallback(
    (trackerList = []) =>
      trackerList.map((item, index, array) => {
        const nextPointCoordinates = extractCoordinatesFromTracker(item);
        const prevPointCoordinates = extractCoordinatesFromTracker(
          array[index === 0 ? index : index - 1],
        );
        return {
          coordinates: [prevPointCoordinates, nextPointCoordinates],
          position: index + 1,
        };
      }),
    [],
  );

  const convertToAllParticipantTracerLines = useCallback(
    (participantTrackers = []) =>
      participantTrackers.map((participantTracker) => ({
        participantId: participantTracker.participantId,
        tracerList: convertToTracerLines(participantTracker.trackerList),
      })),
    [convertToTracerLines],
  );

  const extractCoordinatesFromTracker = (tracker) =>
    tracker.currentLocation.coordinates;

  const participantTracerList = useMemo(
    () => convertToAllParticipantTracerLines(participantTrackers),
    [participantTrackers, convertToAllParticipantTracerLines],
  );

  const colorConfig = useMemo(
    () => ({
      color: getColorConfig(competition.participants),
    }),
    [competition],
  );

  return {
    participantTracerList,
    colorConfig,
  };
}
