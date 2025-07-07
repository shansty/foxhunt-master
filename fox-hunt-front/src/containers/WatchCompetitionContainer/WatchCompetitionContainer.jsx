import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { ADMIN_BASE_URL } from '../../api/constants';
import { buildCompetitionUrl } from 'src/api/utils/navigationUtil';
import { STATUS_RUNNING } from '../../constants/competitionStatusConst';
import { SSE_CONNECTION_STATE } from '../../store/actions/constants/commonConstants';
import { selectLoggedUser } from '../../store/selectors/authSelectors';
import {
  selectCompetition,
  selectCompetitionLoadingState,
} from '../../store/selectors/competitionSelectors';
import {
  selectSseGeneralError,
  selectSseState,
} from '../../store/selectors/sseSelectors';
import {
  createSseProvider,
  removeSseProvider,
} from '../../store/actions/sseActions';
import {
  finishCompetition,
  getCompetitionById,
  getGameState,
} from 'src/store/actions/competitionActions';
import PageTitle from '../PageTitle';
import {
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Grid,
} from '@mui/material';
import { useSseFinishPath, useSsePath } from './useSsePath';
import { useActiveFox, useExpiredCompetition } from './useSseEvent';
import {
  getAllCompetitionSteps,
  getCompletedStep,
} from '../../utils/stepperUtils';
import { signInRequired } from '../../hocs/permissions';
import WatchCompetitionManager from 'src/components/WatchCompetitionManager';
import CurrentUserResults from './CurrentUserResults';
import CompetitionTimers from './CompetitionTimers';
import { FinishCompetitionComponent } from './FinishCompetitionComponent';
import { useCurrentParticipantTrackers } from 'src/containers/WatchCompetitionContainer/useSseEvent';
import { useNavigate } from 'react-router-dom';

const activeStep = 4;
const COMPETITION_EXPIRED_REASON_TO_STOP = 'Competition time expired';

const WatchCompetitionContainer = (props) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const participantTrackers = useCurrentParticipantTrackers([]);
  const competition = useSelector((state) => selectCompetition(state, { id }));
  const isLoading = useSelector(selectCompetitionLoadingState);
  const loggedUser = useSelector(selectLoggedUser);
  const [competitionLoading, setCompetitionLoading] = useState(true);
  const [isAboutToFinish, setIsAboutToFinish] = useState(false);
  const [reasonToStop, setReasonToStop] = useState(null);

  const ssePath = useSsePath();
  const sseFinishPath = useSseFinishPath();
  const sseState = useSelector((state) => selectSseState(state, ssePath));
  const sseGeneralError = useSelector((state) =>
    selectSseGeneralError(state, ssePath),
  );
  const {
    activeFoxIndex,
    foxDuration,
    competitionDuration,
    secondsToCompetitionEnd,
    secondsToFoxChange,
  } = useActiveFox({});

  const { competitionExpired } = useExpiredCompetition({});

  const steps = getAllCompetitionSteps();
  const completedStep = getCompletedStep(competition);

  const disabled = useMemo(() => {
    if (id && competition?.coach?.id) {
      if (
        loggedUser.id === competition.coach.id &&
        competition.status === STATUS_RUNNING
      ) {
        return false;
      }
    }
    return true;
  }, [id, competition, loggedUser]);

  if (!competitionLoading && competition?.status !== STATUS_RUNNING) {
    navigate(buildCompetitionUrl(id));
  }

  const fetchCompetition = useCallback(
    (id) => dispatch(getCompetitionById(id)),
    [dispatch],
  );

  if (competitionExpired || secondsToCompetitionEnd === 0) {
    dispatch(
      finishCompetition({
        id,
        reasonToStop: COMPETITION_EXPIRED_REASON_TO_STOP,
        ssePath: sseFinishPath,
      }),
    );
  }

  useEffect(() => {
    dispatch(
      createSseProvider({
        apiUrl: `${ADMIN_BASE_URL}${ssePath}`,
        identity: ssePath,
      }),
    );
    return () => {
      dispatch(removeSseProvider({ identity: ssePath }));
    };
  }, [ssePath, dispatch]);

  useEffect(() => {
    dispatch(getGameState({ id }));
  }, [dispatch, id]);

  useEffect(() => {
    fetchCompetition(id).then(() => {
      setCompetitionLoading(false);
    });
  }, [id, fetchCompetition]);

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

  if (isLoading) return <div>Loading...</div>;

  if (sseState === SSE_CONNECTION_STATE.CLOSED) {
    // TODO: send notification, when it's ready (FOX-74)
    console.error('Connection CLOSED:', sseGeneralError);
  }

  if (!competition) {
    return <></>;
  }

  const { name, createdBy } = competition;
  const title = `Competition: ${name}`;
  const description = `Created by ${createdBy.firstName} ${createdBy.lastName}`;
  const mapLabel = 'Competition Area';

  return (
    <>
      <PageTitle titleHeading={title} titleDescription={description} />
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 2 }}>
        {steps.map((label, stepNumber) => (
          <Step
            key={label}
            completed={stepNumber <= completedStep && stepNumber !== activeStep}
          >
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Card>
        <CardContent>
          <CompetitionTimers
            foxDuration={foxDuration}
            competitionDuration={competitionDuration}
            secondsToCompetitionEnd={secondsToCompetitionEnd}
            secondsToFoxChange={secondsToFoxChange}
            activeFoxIndex={activeFoxIndex}
          />
          <CurrentUserResults competitionId={id} competition={competition} />
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Grid container direction="column" spacing={3}>
            <Grid item>
              <Typography variant="h5">{mapLabel}</Typography>
            </Grid>
            <WatchCompetitionManager
              competition={competition}
              activeFoxIndex={activeFoxIndex}
              participantTrackers={participantTrackers}
            />
          </Grid>
        </CardContent>
      </Card>
      <FinishCompetitionComponent
        disabled={disabled}
        isAboutToFinish={isAboutToFinish}
        onFinish={onFinish}
        onCancelSendAndExit={onCancelSendAndExit}
        onSendAndExit={onSendAndExit}
        handleReasonToStop={handleReasonToStop}
      />
    </>
  );
};

export default signInRequired(WatchCompetitionContainer);
