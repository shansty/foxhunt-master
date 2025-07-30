import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Grid,
} from '@mui/material';
import { BASE_URL } from 'src/api/constants';
import { buildCompetitionUrl } from 'src/api/utils/navigationUtil';
import { STATUS_RUNNING } from 'src/constants/competitionStatusConst';
import { SSE_CONNECTION_STATE } from 'src/store/constants/commonConstants';
import { selectLoggedUser } from 'src/store/selectors/authSelectors';
import { selectCompetition } from 'src/store/selectors/competitionSelectors';
import {
  selectSseGeneralError,
  selectSseState,
} from 'src/store/selectors/sseSelectors';
import {
  createSseProvider,
  removeSseProvider,
} from 'src/store/actions/sseActions';
import {
  finishCompetition,
  getCompetitionById,
  getGameState,
} from 'src/store/actions/competitionActions';
import { PageTitle } from 'common-front';
import {
  useSseFinishPath,
  useSsePath,
} from 'src/containers/WatchCompetitionContainer/useSsePath';
import {
  useActiveFox,
  useExpiredCompetition,
  useCurrentParticipantTrackers,
} from 'src/containers/WatchCompetitionContainer/useSseEvent';
import {
  getAllCompetitionSteps,
  getCompletedStep,
} from 'src/utils/stepperUtils';
import { signInRequired } from 'src/hocs/permissions';
import WatchCompetitionManager from 'src/components/WatchCompetitionManager';
import CurrentUserResults from 'src/containers/WatchCompetitionContainer/CurrentUserResults';
import CompetitionTimers from 'src/containers/WatchCompetitionContainer/CompetitionTimers';
import { FinishCompetitionComponent } from 'src/containers/WatchCompetitionContainer/FinishCompetitionComponent';
import { competitionErrorSelector } from 'src/store/selectors/errorsSelectors';
import { competitionLoaderSelector } from 'src/store/selectors/loadersSelector';
import { buildNotFoundUrl } from 'src/api/utils/navigationUtil';
import MainLayout from 'src/layouts/MainLayout';

const activeStep = 4;
const COMPETITION_EXPIRED_REASON_TO_STOP = 'Competition time expired';

const WatchCompetitionPage = (props) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const participantTrackers = useCurrentParticipantTrackers([]);
  const competition = useSelector((state) => selectCompetition(state, { id }));
  const isLoading = useSelector(competitionLoaderSelector);
  const loggedUser = useSelector(selectLoggedUser);
  const [competitionLoading, setCompetitionLoading] = useState(true);
  const [isAboutToFinish, setIsAboutToFinish] = useState(false);
  const [reasonToStop, setReasonToStop] = useState(null);
  const competitionError = useSelector(competitionErrorSelector);

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
    (id) => {
      dispatch(getCompetitionById(id));
      if (competitionError) navigate(buildNotFoundUrl());
    },
    [dispatch, competitionError],
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
        apiUrl: `${BASE_URL}${ssePath}`,
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
    fetchCompetition(id)?.then(() => {
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
    <MainLayout>
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
    </MainLayout>
  );
};

export default signInRequired(WatchCompetitionPage);
