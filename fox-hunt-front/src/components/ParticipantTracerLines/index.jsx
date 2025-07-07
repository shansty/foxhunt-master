import React from 'react';

import useParticipantTracerLines from './useParticipantTracerLines';
import ParticipantTracer from './ParticipantTracer';

const ParticipantTracerLines = ({ competition, participantTrackers }) => {
  const { participantTracerList, colorConfig } = useParticipantTracerLines(
    competition,
    participantTrackers,
  );

  return (
    <>
      {participantTracerList.map((participantTracer) => (
        <ParticipantTracer
          key={participantTracer.participantId}
          participantTracer={participantTracer}
          colorConfig={colorConfig}
        />
      ))}
    </>
  );
};

export default ParticipantTracerLines;
