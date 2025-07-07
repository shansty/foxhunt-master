import React from 'react';
import { useSelector } from 'react-redux';
import { Typography, Grid, FormControl as Control, Box } from '@mui/material';
import { TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';

import RangeSlider from 'src/components/UI/RangeSlider/RangeSlider';
import { IconButton as PlayerButton } from 'src/components/UI/Buttons';
import styles from '../styles';
import { getParticipantOptions } from 'src/pages/CreateCompetitionTimeAndLocationPage/utils';
import {
  selectAllTrackersSize,
  selectReplayLoadingState,
} from 'src/store/selectors/replaySelectors';
import useReplayTab from './useReplayTab';
import WatchCompetitionManager from 'src/components/WatchCompetitionManager';

const ReplayTab = ({ competition }) => {
  const isLoading = useSelector(selectReplayLoadingState);
  const size = useSelector(selectAllTrackersSize);

  const { id, participants } = competition;
  const participantsOptions = getParticipantOptions(participants);
  const replayLabel = 'Replay Map';

  const {
    changeStartValue,
    changeParticipant,
    startReplay,
    stopReplay,
    activeFoxIndex,
    displayedTrackers,
    playStarted,
    sliderPosition,
    participantId,
  } = useReplayTab(id, size, isLoading);

  return (
    <Grid container direction="column">
      <Grid item>
        <Typography
          mb={1}
          sx={{
            fontWeight: 500,
          }}
        >
          Options
        </Typography>
      </Grid>
      <Grid item container alignItems="center">
        <Grid item xs={12} md={4}>
          <Control
            variant="standard"
            sx={{
              mb: 2,
              width: '100%',
            }}
          >
            <Autocomplete
              disablePortal
              disableClearable
              size="small"
              id="combo-box-demo"
              onChange={changeParticipant}
              isOptionEqualToValue={(option, { value }) =>
                option.value === value
              }
              options={participantsOptions || []}
              renderInput={(params) => (
                <TextField {...params} label="Participant" />
              )}
            />
          </Control>
        </Grid>
        <Grid item xs={12} md={8} sx={styles.player}>
          <RangeSlider
            styles={{
              root: styles.rangeSlider,
              input: styles.rangeSliderInput,
              startSpan: styles.rangeSliderSpan,
              finishSpan: styles.rangeSliderSpan,
            }}
            id="playerPosition"
            min={1}
            max={size}
            step={1}
            value={sliderPosition}
            disabled={!size || !participantId}
            onChange={(e) => changeStartValue(e.target.value)}
            tooltipPosition="top"
          />
          <Box sx={styles.playerButtons}>
            <PlayerButton
              className={playStarted ? 'hidden' : ''}
              type="button"
              disabled={playStarted || isLoading || !size || !participantId}
              onClick={startReplay}
            >
              <i className="fa fa-play" aria-hidden="true" />
            </PlayerButton>
            <PlayerButton
              className={!playStarted ? 'hidden' : ''}
              type="button"
              disabled={!playStarted}
              onClick={stopReplay}
            >
              <i className="fa fa-stop" aria-hidden="true" />
            </PlayerButton>
          </Box>
        </Grid>
      </Grid>
      <Grid item>
        <Typography variant="h5" mb={2}>
          {replayLabel}
        </Typography>
      </Grid>
      <Grid item>
        <WatchCompetitionManager
          replayCompetition
          competition={competition}
          activeFoxIndex={activeFoxIndex}
          participantTrackers={displayedTrackers}
        />
      </Grid>
    </Grid>
  );
};

export default ReplayTab;
