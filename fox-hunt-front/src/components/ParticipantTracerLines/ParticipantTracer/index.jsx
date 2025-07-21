import React from 'react';
import { Polyline } from 'react-yandex-maps';

import { getColorFromConfig } from 'src/utils/index';

const ParticipantTracer = ({ participantTracer, colorConfig }) => {
  const strokeColor = getColorFromConfig(
    colorConfig,
    participantTracer.participantId,
  );
  return participantTracer.tracerList.map((tracer) => (
    <Polyline
      key={participantTracer.participantId + tracer.position}
      geometry={tracer.coordinates}
      options={{
        balloonCloseButton: false,
        strokeColor,
        strokeWidth: 4,
        strokeOpacity: 1 / tracer.position,
      }}
    />
  ));
};

export default ParticipantTracer;
