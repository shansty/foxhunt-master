import React, { useMemo } from 'react';
import { Typography, Grid } from '@mui/material';

import { CountdownTimer } from 'src/components/Timer/CountdownTimer';

const timerInterval = 1000;
const warningColorPercentage = 0.25;
const remainingTimeBottomLabel = 'Time is up';
const foxTimerBottomLabel = 'Foxes are silent';

function CompetitionTimers({
  activeFoxIndex,
  competitionDuration,
  foxDuration,
  secondsToCompetitionEnd,
  secondsToFoxChange,
}) {
  const activeFoxLabel = useMemo(
    () => `Fox # ${activeFoxIndex}`,
    [activeFoxIndex],
  );

  return (
    <Grid container direction="row" spacing={5} justifyContent="center">
      <Grid item>
        <Grid container direction="column" spacing={2} alignItems="center">
          <Grid item>
            <Typography
              className="text-black px-2 font-weight-bold"
              component="div"
            >
              Remaining competition time
            </Typography>
          </Grid>
          <Grid item>
            <CountdownTimer
              bottomLabel={remainingTimeBottomLabel}
              displayTopLabel
              initValue={secondsToCompetitionEnd || 0}
              timerInterval={timerInterval} // in millis.
              timerSubtraction={1} // to display minus '{number}' of seconds per interval
              totalValue={competitionDuration || 0}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Grid container direction={'column'} spacing={2} alignItems={'center'}>
          <Grid item>
            <Typography
              className="text-black px-2 font-weight-bold"
              component="div"
            >
              Time to fox change
            </Typography>
          </Grid>
          <Grid item>
            <CountdownTimer
              bottomLabel={foxTimerBottomLabel}
              displayTopLabel={activeFoxIndex !== 0}
              initValue={secondsToFoxChange || 0}
              timerInterval={timerInterval} // in millis.
              timerSubtraction={1} // to display minus '{number}' of seconds per interval
              topLabel={activeFoxLabel}
              totalValue={foxDuration}
              warningColorPercentage={warningColorPercentage}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default CompetitionTimers;
