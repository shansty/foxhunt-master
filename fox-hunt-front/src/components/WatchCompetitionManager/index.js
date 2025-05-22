import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { competition as CompetitionShape } from 'src/utils/FoxHuntPropTypes';
import { Grid } from '@mui/material';
import LocationMapContainer from 'src/containers/LocationMapContainer';
import MapLegend from 'src/components/UI/MapLegend';
import { getPointsProps } from 'src/utils/mapUtils';
import { useIsMobile } from 'common-front';
import ParticipantTracerLines from 'src/components/ParticipantTracerLines';

function WatchCompetitionManager({
  activeFoxIndex,
  competition,
  dialog,
  participantTrackers,
}) {
  const { location } = competition;
  const isMobile = useIsMobile();

  const customMarkers = useMemo(
    () => getPointsProps(competition, activeFoxIndex, participantTrackers),
    [competition, activeFoxIndex, participantTrackers],
  );

  return (
    <Grid item container spacing={2}>
      <Grid item xs={12} md={dialog ? 12 : 9} xl={dialog ? 12 : 10}>
        <LocationMapContainer
          customMarkers={customMarkers}
          forbiddenAreas={location.forbiddenAreas}
          geometryCenter={{
            displayMarker: false,
            coordinates: location.center,
          }}
          polygonCoordinates={location.coordinates}
          zoomValue={location.zoom}
        >
          <ParticipantTracerLines
            competition={competition}
            participantTrackers={participantTrackers}
          />
        </LocationMapContainer>
      </Grid>
      <Grid item xs={12} md={dialog ? 12 : 3} xl={dialog ? 12 : 2}>
        <MapLegend
          direction={isMobile || dialog ? 'row' : 'column'}
          titleStyles={{ marginBottom: '1rem' }}
        />
      </Grid>
    </Grid>
  );
}

WatchCompetitionManager.propTypes = {
  activeFoxIndex: PropTypes.number,
  competition: CompetitionShape.propTypes.isRequired,
  disabled: PropTypes.bool,
};

WatchCompetitionManager.defaultProps = {
  activeFoxIndex: null,
};

export default WatchCompetitionManager;
