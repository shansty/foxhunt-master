import React, { useMemo } from 'react';
import { Polyline } from 'react-yandex-maps';

import { convertAllParticipantTrackersListToTracerList } from '../../../utils/mapUtils';
import { getColorConfig } from '../../../utils/index';
import { getColorFromConfig } from '../../../utils/competitionUtils';

export default function useRenderParticipantTracerLines(
  competition,
  participantTrackers,
) {
  const participantTracerList = useMemo(
    () => convertAllParticipantTrackersListToTracerList(participantTrackers),
    [participantTrackers],
  );

  const colorConfig = useMemo(
    () => ({
      color: getColorConfig(competition.participants),
    }),
    [competition],
  );

  const renderParticipantTracerLines = () => {
    if (participantTracerList.length === 0) {
      return;
    }

    return participantTracerList.map((participantTracer) =>
      participantTracer.tracerList.map((tracer) => (
        <Polyline
          key={participantTracer.participantId + tracer.position}
          geometry={tracer.coordinates}
          options={{
            balloonCloseButton: false,
            strokeColor: getColorFromConfig(
              colorConfig,
              participantTracer.participantId,
              '#e80909',
            ),
            strokeWidth: 4,
            strokeOpacity: 1 / tracer.position,
          }}
        />
      )),
    );
  };

  return renderParticipantTracerLines;
}
