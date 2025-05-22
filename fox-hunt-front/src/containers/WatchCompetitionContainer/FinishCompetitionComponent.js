import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { Grid, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';

const FINISH_COMPETITION_REASON_PLACEHOLDER = `E.g., Earthquake, Sandstorm, 
Extraterrestrial attack etc...`;

export const FinishCompetitionComponent = (props) => {
  const {
    disabled,
    isAboutToFinish,
    onFinish,
    onCancelSendAndExit,
    onSendAndExit,
    handleReasonToStop,
  } = props;

  return (
    <Fragment>
      {!isAboutToFinish && (
        <Grid item>
          <Button
            disabled={disabled}
            variant={'contained'}
            color={'primary'}
            fullWidth
            onClick={onFinish}
          >
            Finish Competition
          </Button>
        </Grid>
      )}
      {isAboutToFinish && (
        <>
          <Grid item>
            <Typography
              className="text-black px-2 font-weight-bold"
              component="div"
            >
              Please, indicate the reasons for halting this competition
            </Typography>
          </Grid>
          <Grid item>
            <TextField
              onChange={handleReasonToStop}
              variant={'outlined'}
              multiline
              fullWidth
              inputProps={{ maxLength: 200 }}
              placeholder={FINISH_COMPETITION_REASON_PLACEHOLDER}
            />
          </Grid>
        </>
      )}
      {isAboutToFinish && (
        <>
          <Grid
            item
            container
            direction={'row'}
            spacing={1}
            justifyContent={'space-between'}
          >
            <Button
              disabled={disabled}
              variant="contained"
              color="secondary"
              onClick={onCancelSendAndExit}
            >
              Cancel
            </Button>
            <Button
              disabled={disabled}
              variant="contained"
              color="primary"
              onClick={onSendAndExit}
            >
              Send and Exit
            </Button>
          </Grid>
        </>
      )}
    </Fragment>
  );
};

FinishCompetitionComponent.propTypes = {
  isAboutToFinish: PropTypes.bool.isRequired,
  onFinish: PropTypes.func.isRequired,
  onCancelSendAndExit: PropTypes.func.isRequired,
  onSendAndExit: PropTypes.func.isRequired,
  handleReasonToStop: PropTypes.func.isRequired,
};
