import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { competition as CompetitionShape } from 'src/utils/FoxHuntPropTypes';
import { FormControlLabel, Grid } from '@mui/material';
import LocationMapContainer from 'src/containers/LocationMapContainer';
import MapLegend from 'src/components/UI/MapLegend';
import { getPointsProps } from 'src/utils/mapUtils';
import { useIsMobile } from 'common-front';
import ParticipantTracerLines from 'src/components/ParticipantTracerLines';
import Checkbox from '@mui/material/Checkbox';

function WatchCompetitionManager({
  activeFoxIndex,
  competition,
  dialog,
  participantTrackers,
}) {
  const { location } = competition;
  const isMobile = useIsMobile();
  const [isFoxRangeEnabled, setIsFoxRangeEnabled] = useState(true);

  const customMarkers = useMemo(
    () =>
      getPointsProps(
        competition,
        activeFoxIndex,
        participantTrackers,
        isFoxRangeEnabled,
      ),
    [competition, activeFoxIndex, participantTrackers, isFoxRangeEnabled],
  );

  return (
    <>
      {competition.foxoringEnabled && <FormControlLabel
        sx={{ ml: 1 }}
        control={
          <Checkbox
            checked={isFoxRangeEnabled}
            onChange={(e) => setIsFoxRangeEnabled(e.target.checked)}
          />
        }
        label="Show Fox Ranges"
      />}
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
            isFoxRangeEnabled={isFoxRangeEnabled}
            foxoringEnabled={competition.foxoringEnabled}
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
    </>
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
