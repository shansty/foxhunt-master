import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import dayjs from 'dayjs';
import inside from 'point-in-polygon';
import {
  Button,
  Card,
  CardContent,
  FormLabel,
  Grid,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Tooltip,
  Typography,
  Zoom,
} from '@mui/material';
import { selectCompetition } from 'src/store/selectors/competitionSelectors';
import { competitionLoaderSelector } from 'src/store/selectors/loadersSelector';
import { competitionErrorSelector } from 'src/store/selectors/errorsSelectors';
import {
  getCompetitionById,
  getCurrentCompetitions,
  startCompetition,
  updateCompetition,
} from 'src/store/actions/competitionActions';
import { PageTitle } from 'common-front';
import LocationMapContainer from 'src/containers/LocationMapContainer';
import DragDropTableRow from 'src/components/UI/DragDropTableRow/DragDropTableRow';
import {
  convertStartPairsForRender,
  generateFoxFrequency,
  generatePoint,
  getCompetitionDistance,
  getStartPairs,
  getStartParticipants,
  PointsMap,
} from 'src/containers/LaunchCompetitionContainer';
import {
  getFinishMarkerProps,
  getFoxMarkerProps,
  getStartMarkerProps,
} from 'src/utils';
import {
  getAllCompetitionSteps,
  getCompletedStep,
} from 'src/utils/stepperUtils';
import { buildCompetitionInvitationsByIdUrl } from 'src/api/utils/navigationUtil';
import { selectLoggedUser } from 'src/store/selectors/authSelectors';
import { STATUS_SCHEDULED } from 'src/constants/competitionStatusConst';
import { isFeatureEnabled } from 'src/featureToggles/FeatureTogglesUtils';
import { FORBIDDEN_AREA } from 'src/featureToggles/featureNameConstants';
import MainLayout from 'src/layouts/MainLayout';
import { signInRequired } from 'src/hocs/permissions';

const DISTANCE_TOOLTIP = `Distance is calculated as length of line 
Start- Fox1 -Fox2- Fox-3 -Fox4-Fox5 - Finish`;

const initialState = {
  startPairs: [],
  startParticipants: [],
  sort: {},
  foxPoints: {},
  distance: 0,
};

function LaunchCompetitionPage(props) {
  const { isCompetitionLoading, loggedUser, getCompetitionById } = props;
  const [state, setState] = useState(initialState);
  const forbiddenAreaRef = useRef();
  const polygonRef = useRef();
  const navigate = useNavigate();
  const { id } = useParams();
  const competition = useSelector((state) => selectCompetition(state, { id }));

  useEffect(() => {
    setState((state) => ({
      ...state,
      startPairs: getStartPairs(competition.participants),
      startParticipants: getStartParticipants(
        getStartPairs(competition.participants),
        competition,
      ),
    }));
  }, [competition]);

  useEffect(() => {
    getCompetitionById(id);
  }, [getCompetitionById]);

  useEffect(() => {
    setState((prevState) => {
      if (!_.isEqual(prevState.startParticipants, competition.participants)) {
        const startPairs = getStartPairs(competition.participants);
        const startParticipants = getStartParticipants(startPairs, competition);
        return { ...prevState, startPairs, startParticipants };
      }
      return prevState;
    });
  }, [competition]);

  const isPointInForbiddenAreas = (point) => {
    const isForbiddenAreaFeatureEnabled = isFeatureEnabled(FORBIDDEN_AREA);
    if (isForbiddenAreaFeatureEnabled) {
      const insideForbiddenArea = competition.location.forbiddenAreas.filter(
        (area) => inside(point, area.polygon),
      );
      return !_.isEmpty(insideForbiddenArea);
    } else return false;
  };

  const generateFoxLocation = () => {
    const foxPoints = {};
    const bounds = polygonRef.current.geometry.getBounds();
    const { startPoint, finishPoint, foxAmount, frequency, foxRange } = competition;
    console.dir({ competition })
    const pointsMap = new PointsMap([startPoint, finishPoint]);

    while (Object.keys(foxPoints).length !== foxAmount) {
      const coordinates = generatePoint(bounds);
      if (coordinates === null) break;
      const isInsideForbiddenArea = isPointInForbiddenAreas(coordinates);
      if (
        !pointsMap.contains(coordinates) &&
        polygonRef.current.geometry.contains(coordinates) &&
        !isInsideForbiddenArea
      ) {
        const foxIndex = Object.keys(foxPoints).length + 1;
        const foxFrequency = generateFoxFrequency(frequency);
        const fox = getFoxMarkerProps({
          coordinates,
          draggable: true,
          id: foxIndex,
          label: `T${foxIndex}`,
          frequency: foxFrequency,
          foxRange,
        });

        foxPoints[fox.id] = {
          ...fox,
          index: foxIndex,
          frequency: foxFrequency,
          foxRange,
          hearingOrigin: coordinates, // 👈 Needed to draw hearing circle
        };
      }
    }
    setState((state) => ({
      ...state,
      foxPoints,
      distance: getCompetitionDistance(startPoint, finishPoint, foxPoints),
    }));
  };

  const isDistanceExceeded = () => {
    console.dir({ distance: state.distance });
    console.dir({ distanceLength: state.distance });
    return state.distance > competition.distanceType?.distanceLength;
  };

  const startCompetition = () => {
    const { foxPoints: foxPointsProps, startParticipants } = state;
    if (isRunBtnDisabled() || _.isEmpty(foxPointsProps)) return;
    const foxPoints = _.map(
      foxPointsProps,
      ({ coordinates, frequency, id, index }) => ({
        coordinates,
        frequency,
        index,
        label: id,
      }),
    );
    const participants = startParticipants.map(
      ({ color, id, pairPosition, participantNumber }) => ({
        color,
        id,
        participantNumber,
        startPosition: pairPosition,
      }),
    );

    props.startCompetition({
      id,
      foxPoints,
      participants,
    });
  };

  const onTableRowDragEnd = (result) => {
    if (!result.destination) return;

    const startIndex = result.source.index;
    const endIndex = result.destination.index;
    const reordered = [...state.startPairs];

    const [removed] = reordered.splice(startIndex, 1);
    reordered.splice(endIndex, 0, removed);
    const updatedIndexes = reordered.map((position, index) => ({
      ...position,
      position: index + 1,
    }));
    const updatedParticipants = getStartParticipants(
      updatedIndexes,
      competition,
    );

    setState((state) => ({
      sort: {},
      startPairs: updatedIndexes,
      startParticipants: updatedParticipants,
      ...state,
    }));
  };

  const onPointDragEnd = (event) => {
    const { foxPoints } = state;
    const { startPoint, finishPoint } = competition;
    const pointId = event.get('target').properties.get('id');
    const pointCoordinates = event.get('target').geometry.getCoordinates();
    const foxPoint = foxPoints[pointId];
    const isInForbiddenArea = isPointInForbiddenAreas(pointCoordinates);

    if (
      polygonRef.current &&
      polygonRef.current.geometry.contains(pointCoordinates) &&
      !isInForbiddenArea
    ) {
      const updatedFoxPoints = {
        ...foxPoints,
        [pointId]: {
          ...foxPoint,
          coordinates: pointCoordinates,
        },
      };

      setState((state) => ({
        ...state,
        distance: getCompetitionDistance(
          finishPoint,
          startPoint,
          updatedFoxPoints,
        ),
        foxPoints: updatedFoxPoints,
      }));
      return;
    }
    event.get('target').geometry.setCoordinates(foxPoint.coordinates);
  };

 function getDistanceBetweenPoints(pointA, pointB) {
  if (!Array.isArray(pointA) || !Array.isArray(pointB)) return 0;
  const [lng1, lat1] = pointA;
  const [lng2, lat2] = pointB;

  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

  const getPointsProps = () => {
    const pointsProps = [];
    const { foxPoints } = state;
    const { startPoint, finishPoint } = competition;

    if (startPoint.length)
      pointsProps.push(getStartMarkerProps({ coordinates: startPoint }));
    if (finishPoint.length)
      pointsProps.push(getFinishMarkerProps({ coordinates: finishPoint }));

    Object.values(foxPoints).forEach((markerProps) => {
      const distanceMoved = getDistanceBetweenPoints(
        markerProps.hearingOrigin,
        markerProps.coordinates
      );
      const effectiveRadius =
        distanceMoved < markerProps.foxRange
          ? markerProps.foxRange - distanceMoved
          : 0;

      pointsProps.push(markerProps); // 🦊 fox marker

      // 🔊 Dynamic hearing range (green circle)
      if (effectiveRadius > 0) {
        pointsProps.push({
          type: 'circle',
          id: `${markerProps.id}-hearing`,
          coordinates: markerProps.coordinates,
          radius: effectiveRadius,
          options: {
            draggable: false,
            fillColor: '#00FF0011',
            strokeColor: '#00FF00',
            strokeOpacity: 0.5,
            strokeWidth: 2,
          },
        });
      }

      // 🧭 Static range boundary (dashed circle)
      pointsProps.push({
        type: 'circle',
        id: `${markerProps.id}-range-limit`,
        coordinates: markerProps.hearingOrigin,
        radius: markerProps.foxRange,
        options: {
          draggable: false,
          strokeColor: '#00000055',
          strokeWidth: 1,
          strokeStyle: 'dash',
          fillColor: '#00000000',
        },
      });
    });

    return pointsProps;
  };


  const isRunBtnDisabled = () => {
    const isAboutToStart =
      Object.keys(state.foxPoints).length > 0 &&
      competition.coach.id === loggedUser.id &&
      competition.status === STATUS_SCHEDULED;
    return !isAboutToStart;
  };

  const goToParticipantsStep = () => {
    navigate(buildCompetitionInvitationsByIdUrl(id));
  };

  const renderReadinessMessage = () => {
    const style = {
      textAlign: 'center',
      marginTop: '20px',
      marginBottom: '-10px',
    };
    const foxRequiredMsg = <div>Foxes must be placed on the location!</div>;
    const areFoxesSelected = Object.keys(state.foxPoints).length;
    let finalMessage = null;

    if (!areFoxesSelected) {
      finalMessage = (
        <div className="alert alert-warning" style={style}>
          {foxRequiredMsg}
        </div>
      );
    }
    return finalMessage;
  };

  const { coordinates, center, zoom, forbiddenAreas } = competition.location;

  const title = `Competition: ${competition.name}`;
  const description = `Created by ${competition.createdBy.firstName} ${competition.createdBy.lastName}`;
  const activeStep = 3;
  const steps = getAllCompetitionSteps();
  const completedStep = getCompletedStep(competition);

  if (!isCompetitionLoading && _.isEmpty(competition.participants)) {
    goToParticipantsStep();
  } else if (!isCompetitionLoading && competition.status !== STATUS_SCHEDULED) {
    navigate(buildCompetitionInvitationsByIdUrl(id));
  }

  let disabled = true;
  if (id && competition?.coach?.id) {
    if (
      loggedUser.id === competition.coach.id &&
      competition.status === STATUS_SCHEDULED
    ) {
      disabled = false;
    }
  }

  return (
    <MainLayout>
      {!isCompetitionLoading && (
        <>
          <PageTitle titleHeading={title} titleDescription={description} />
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 2 }}>
            {steps.map((label, stepNumber) => (
              <Step
                key={label}
                completed={
                  stepNumber <= completedStep && stepNumber !== activeStep
                }
              >
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Card variant={'outlined'}>
            <CardContent>
              <Grid container direction={'column'} spacing={3}>
                <Grid item container direction={'column'} spacing={1}>
                  <Grid item>
                    <TextField
                      disabled
                      fullWidth
                      label={'Amount of Foxes*'}
                      value={competition.foxAmount}
                      variant={'outlined'}
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      disabled
                      fullWidth
                      label={'Distance Type*'}
                      value={competition.distanceType?.name}
                      variant={'outlined'}
                    />
                  </Grid>

                  <Grid item>
                    <Typography
                      className="text-black px-2 font-weight-bold"
                      component="div"
                    >
                      Start Pairs
                    </Typography>
                  </Grid>
                  <DragDropTableRow
                    columns={[
                      { name: 'Start #' },
                      { name: 'Participant 1' },
                      { name: 'Participant 2' },
                    ]}
                    disabled={disabled}
                    onDragEnd={onTableRowDragEnd}
                    rowsData={convertStartPairsForRender(state.startPairs)}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Grid container direction={'column'} spacing={3}>
                <Grid item container direction={'column'} spacing={1}>
                  <Tooltip title={DISTANCE_TOOLTIP} TransitionComponent={Zoom}>
                    <FormLabel error={isDistanceExceeded()}>
                      Total Distance - {state.distance} meters
                      {isDistanceExceeded() && '. Maximum length exceeded!'}
                    </FormLabel>
                  </Tooltip>

                  <Grid item>
                    <Button
                      color={'primary'}
                      disabled={disabled}
                      fullWidth
                      onClick={generateFoxLocation}
                      variant={'contained'}
                    >
                      Generate Fox Location
                    </Button>
                  </Grid>
                  <LocationMapContainer
                    className="margin-top-10"
                    customMarkers={getPointsProps()}
                    forbiddenAreas={forbiddenAreas}
                    geometryCenter={{
                      coordinates: center,
                      displayMarker: false,
                    }}
                    onDragEnd={onPointDragEnd}
                    polygonCoordinates={coordinates}
                    setForbiddenAreasRef={(ref) => {
                      if (!forbiddenAreaRef.current)
                        forbiddenAreaRef.current = ref;
                    }}
                    setPolygonInstanceRef={(ref) => {
                      if (!polygonRef.current) polygonRef.current = ref;
                    }}
                    zoomValue={zoom}
                  />

                  {renderReadinessMessage()}
                </Grid>
                <Grid
                  container
                  direction={'row'}
                  item
                  justifyContent={'space-between'}
                  spacing={1}
                >
                  <Button
                    color="secondary"
                    onClick={goToParticipantsStep}
                    variant="contained"
                  >
                    Back
                  </Button>
                  <Button
                    color="primary"
                    disabled={isRunBtnDisabled()}
                    onClick={startCompetition}
                    type={'submit'}
                    variant="contained"
                  >
                    Next
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </>
      )}
    </MainLayout>
  );
}

LaunchCompetitionPage.propTypes = {
  competition: PropTypes.shape({
    distanceType: PropTypes.shape({
      distanceLength: PropTypes.number,
      id: PropTypes.number,
      maxNumberOfFox: PropTypes.number,
      name: PropTypes.string,
    }),
    finishPoint: PropTypes.arrayOf(PropTypes.number).isRequired,
    foxAmount: PropTypes.number.isRequired,
    foxDuration: PropTypes.number.isRequired,
    foxRange: PropTypes.number.isRequired,
    hasSilenceInterval: PropTypes.bool.isRequired,
    location: PropTypes.shape({
      center: PropTypes.arrayOf(PropTypes.number),
      coordinates: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
      description: PropTypes.string,
      name: PropTypes.string,
      zoom: PropTypes.number,
    }).isRequired,
    name: PropTypes.string.isRequired,
    notes: PropTypes.string.isRequired,
    participants: PropTypes.arrayOf(
      PropTypes.shape({
        firstName: PropTypes.string.isRequired,
        id: PropTypes.number.isRequired,
        lastName: PropTypes.string,
      }),
    ),
    startDate: PropTypes.string.isRequired,
    startPoint: PropTypes.arrayOf(PropTypes.number).isRequired,
  }).isRequired,
  error: PropTypes.string,
  getCompetitionById: PropTypes.func.isRequired,
  isCompetitionLoading: PropTypes.bool.isRequired,
  startCompetition: PropTypes.func.isRequired,
  updateCompetition: PropTypes.func.isRequired,
};

LaunchCompetitionPage.defaultProps = {
  competition: {
    createdBy: { firstName: '', lastName: '' },
    distanceType: { name: '' },
    distanceTypeId: 0,
    finishPoint: [],
    foxAmount: 0,
    foxDuration: 0,
    hasSilenceInterval: false,
    location: { center: [], coordinates: [], forbiddenAreas: [] },
    name: '',
    notes: '',
    participants: [],
    startDate: dayjs().toISOString(),
    startPoint: [],
  },
};

const mapStateToProps = (state) => ({
  error: competitionErrorSelector(state),
  isCompetitionLoading: competitionLoaderSelector(state),
  loggedUser: selectLoggedUser(state),
});

export default connect(mapStateToProps, {
  getCompetitionById,
  getCurrentCompetitions,
  startCompetition,
  updateCompetition,
})(signInRequired(LaunchCompetitionPage));
