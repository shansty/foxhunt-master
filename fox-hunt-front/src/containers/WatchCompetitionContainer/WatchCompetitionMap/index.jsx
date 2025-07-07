import React, { useState, useMemo, useRef } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { competition as CompetitionShape } from 'src/utils/FoxHuntPropTypes';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import LocationMapContainer from 'src/containersLocationMapContainer';
import { FinishCompetitionComponent } from '../FinishCompetitionComponent';
import MapLegend from 'src/components/UI/MapLegend';
import { getPointsProps } from 'src/utils/mapUtils';
import { useCurrentLocation } from '../useSseEvent';
import { useSseFinishPath } from '../useSsePath';
import { finishCompetition } from 'src/store/actions/competitionActions';
import useIsMobile from 'common-front';
import RenderParticipantTracerLines from 'src/components/RenderParticipantTracerLines';

function WatchCompetitionMap({
  activeFoxIndex,
  competition,
  disabled,
  displayedTrackers,
  replayCompetition,
}) {
  const { id, location } = competition;
  const [isAboutToFinish, setIsAboutToFinish] = useState(false);
  const [reasonToStop, setReasonToStop] = useState(null);

  const forbiddenAreaRef = useRef(null);
  const currentParticipantTrackers = useCurrentLocation([]);
  const participantTrackers = replayCompetition
    ? displayedTrackers
    : currentParticipantTrackers;
  const sseFinishPath = useSseFinishPath();

  const dispatch = useDispatch();
  const isMobile = useIsMobile();

  const customMarkers = useMemo(
    () => getPointsProps(competition, activeFoxIndex, participantTrackers),
    [competition, activeFoxIndex, participantTrackers],
  );

  const onFinish = () => {
    setIsAboutToFinish(true);
  };

  const onCancelSendAndExit = () => {
    setIsAboutToFinish(false);
  };

  const onSendAndExit = () => {
    dispatch(finishCompetition({ id, reasonToStop, ssePath: sseFinishPath }));
  };

  const handleReasonToStop = (event) => {
    const inputReason = event.target.value;
    setReasonToStop(inputReason);
  };

  return (
    <Card>
      <CardContent>
        <Grid container direction="column" spacing={3}>
          <Grid item>
            <Typography variant="h5">
              {replayCompetition ? 'Replay map' : 'Competition Area'}
            </Typography>
          </Grid>
          <Grid item container spacing={2}>
            <Grid item xs={12} md={9} xl={10}>
              <LocationMapContainer
                customMarkers={customMarkers}
                forbiddenAreas={location.forbiddenAreas}
                geometryCenter={{
                  displayMarker: false,
                  coordinates: location.center,
                }}
                polygonCoordinates={location.coordinates}
                setForbiddenAreasRef={(ref) => (forbiddenAreaRef.current = ref)}
                zoomValue={location.zoom}
              >
                <RenderParticipantTracerLines
                  competition={competition}
                  participantTrackers={participantTrackers}
                />
              </LocationMapContainer>
            </Grid>
            <Grid item xs={12} md={3} xl={2}>
              <MapLegend
                titleStyles={{ marginBottom: '1rem' }}
                direction={isMobile ? 'row' : 'column'}
              />
            </Grid>
          </Grid>
          {!replayCompetition && (
            <FinishCompetitionComponent
              disabled={disabled}
              handleReasonToStop={handleReasonToStop}
              isAboutToFinish={isAboutToFinish}
              onCancelSendAndExit={onCancelSendAndExit}
              onFinish={onFinish}
              onSendAndExit={onSendAndExit}
            />
          )}
        </Grid>
      </CardContent>
    </Card>
  );
}

WatchCompetitionMap.propTypes = {
  competition: CompetitionShape.propTypes.isRequired,
  activeFoxIndex: PropTypes.number,
  disabled: PropTypes.bool,
};

WatchCompetitionMap.defaultProps = {
  activeFoxIndex: null,
};

export default WatchCompetitionMap;
