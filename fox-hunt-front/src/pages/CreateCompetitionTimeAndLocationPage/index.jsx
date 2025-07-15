import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import LocationMapContainer from 'src/containers/LocationMapContainer';
import * as compActions from 'src/store/actions/competitionActions';
import {
  getCoachOptions,
  getMinCompetitionStartDate,
  locationListOnTemplateFunction,
} from './utils';
import { Card } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import { CheckboxWithLabel, TextField } from 'formik-mui';
import { FormikInput, FormikSimpleSelect } from 'common-front';
import { PageTitle } from 'common-front';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import DatePickerField from 'src/components/Formik/FormikDatePicker';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import RoomSharpIcon from '@mui/icons-material/RoomSharp';
import { connect } from 'react-redux';
import { getParticipants } from 'src/store/actions/participantActions';
import {
  getLocations,
  getLocationById,
} from 'src/store/actions/locationsActions';
import { selectLoggedUser } from 'src/store/selectors/authSelectors';
import { selectAllCoaches } from 'src/store/selectors/participantSelectors';
import {
  selectAllLocations,
  selectLocation,
} from 'src/store/selectors/locationsSelectors';
import {
  selectAllCompetitions,
  selectCompetition,
} from 'src/store/selectors/competitionSelectors';
import {
  locationLoaderSelector,
  competitionsLoaderSelector,
} from 'src/store/selectors/loadersSelector';
import { competitionErrorSelector } from 'src/store/selectors/errorsSelectors';
import { createStructuredSelector } from 'reselect';
import { getFinishMarkerProps, getStartMarkerProps } from 'src/utils';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import {
  getAllCompetitionSteps,
  getCompletedStep,
} from 'src/utils/stepperUtils';
import {
  buildCompetitionUrl,
  buildCreateTimeAndLocationCompetitionUrl,
  buildSettingsCompetitionByIdUrl,
} from 'src/api/utils/navigationUtil';
import {
  NOTIFY_MAP,
  NOTIFY_NOT_UNIQUE_COMPETITION_NAME,
} from 'src/constants/notifyConst';
import {
  COMPETITION_NOTES_MAX_LENGTH,
  COMPETITION_NAME_MAX_LENGTH,
  COMPETITION_NAME_MIN_LENGTH,
} from 'src/constants/commonConst';
import { STATUS_SCHEDULED } from 'src/constants/competitionStatusConst';
import inside from 'point-in-polygon';
import _ from 'lodash';
import { isFeatureEnabled } from 'src/featureToggles/FeatureTogglesUtils';
import { FORBIDDEN_AREA } from 'src/featureToggles/featureNameConstants';
import { createErrorMessage } from 'src/utils/notificationUtil';
import { enqueueSnackbar } from 'src/store/actions/notificationsActions';
import { DATE_FORMATS } from 'src/constants/dateFormatConstants';
import { ERRORS } from 'src/constants/commonConst';
import MainLayout from 'src/layouts/MainLayout';
import { signInRequired } from 'src/hocs/permissions';
import {
  changeCompetitionDate,
  changeCoordinateLocation,
} from 'src/store/slices/competitionsSlice';

const competitionValidationSchema = Yup.object().shape({
  coachId: Yup.number().required(ERRORS.REQUIRED_FIELD),
  locationId: Yup.string()
    .required(ERRORS.REQUIRED_FIELD)
    .notOneOf(['0', 'Not Selected']),
  name: Yup.string()
    .required(ERRORS.REQUIRED_FIELD)
    .min(COMPETITION_NAME_MIN_LENGTH)
    .max(COMPETITION_NAME_MAX_LENGTH),
  notes: Yup.string().max(COMPETITION_NOTES_MAX_LENGTH),
  startDate: Yup.date().min(
    new Date(),
    ERRORS.COMPETITION_MIN_START_DATE_MESSAGE,
  ),
});

const CreateCompetitionTimeAndLocationPage = (props) => {
  const initialState = {
    areAllObjectsFetched: false,
    finishPoint: props.competition.finishPoint || [],
    isAddingFinishPoint: false,
    isAddingStartPoint: false,
    isMapShown: false,
    isNotUniqueName: false,
    startPoint: props.competition.startPoint || [],
  };

  const {
    changeCompetitionDate,
    changeCoordinateLocation,
    coaches,
    competition,
    createCompetition,
    fetchCompetitions,
    fetchLocationById,
    fetchLocations,
    fetchParticipants,
    isLocationLoading,
    location,
    locations,
    loggedUser,
    showErrorMessage,
    updateCompetition,
  } = props;

  const activeStep = 0;

  const completedStep = getCompletedStep(competition);

  const steps = getAllCompetitionSteps();

  const { createdBy, coach } = competition;

  const { id: urlId } = useParams();

  let disabled = false;
  let isUserCoach = true;
  if (urlId && createdBy.id && coach.id) {
    if (loggedUser.id !== coach.id) {
      isUserCoach = false;
    }
    if (
      (loggedUser.id !== createdBy.id && loggedUser.id !== coach.id) ||
      competition.status !== STATUS_SCHEDULED
    ) {
      disabled = true;
      isUserCoach = !isUserCoach;
    }
  }

  const [state, setState] = useState(initialState);
  const navigate = useNavigate();

  useEffect(() => {
    if (urlId) {
      fetchCompetitions();
      setState((state) => ({
        ...state,
        isMapShown: !!urlId,
      }));
    }
    fetchLocations();
    fetchParticipants();
  }, [fetchCompetitions, fetchLocations, fetchParticipants, urlId]);

  const { isAddingStartPoint, isAddingFinishPoint, startPoint, finishPoint } =
    state;

  const locationListOnTemplate = locationListOnTemplateFunction(locations);

  const coachesOptions = getCoachOptions(coaches, loggedUser?.id);

  const minDate = getMinCompetitionStartDate();

  const title = urlId
    ? `Competition: ${competition.name}`
    : 'Create competition';

  const description = urlId
    ? `Created by ${createdBy.firstName} ${createdBy.lastName}`
    : '';

  const isForbiddenAreaFeatureEnabled = isFeatureEnabled(FORBIDDEN_AREA);

  const initialValues = { ...competition };
  if (competition.location.id) {
    initialValues.locationId = competition.location.id;
  }
  useEffect(() => {
    if (!state.isMapShown && initialValues.locationId) {
      setState((prevState) => ({
        ...prevState,
        isMapShown: true,
      }));
    }
  }, [initialValues.locationId, state.isMapShown]);

  if (competition.coach) {
    initialValues.coachId = competition.coach.id;
  } else {
    if (coachesOptions.length !== 0) {
      initialValues.coachId = coachesOptions[0].value;
    }
  }

  const polygonRef = useRef(null);

  const forbiddenAreaRef = useRef(null);

  useEffect(() => {
    setState((state) => ({
      finishPoint: competition.finishPoint,
      startPoint: competition.startPoint,
      ...state,
    }));
  }, [competition.startPoint, competition.finishPoint]);

  const changeStartDate = (competition) => {
    const changedData = new Date(competition.startDate);
    changeCompetitionDate(competition, changedData.toISOString());
  };

  const changeStartingCoordinateLocation = (values, handleChange, event) => {
    const locationSelected = locations.find(
      (location) => location.id === Number.parseInt(event.target.value),
    );
    fetchLocationById(locationSelected.id);
    changeCoordinateLocation(values, locationSelected);
    handleChange(event);
    setState({
      finishPoint: [],
      isAddingFinishPoint: false,
      isAddingStartPoint: false,
      isMapShown: !!locationSelected,
      startPoint: [],
      ...state,
    });
  };

  const isPointInForbiddenAreas = (point) => {
    if (isForbiddenAreaFeatureEnabled) {
      const insideForbiddenArea = location.forbiddenAreas.filter((area) =>
        inside(point, area.polygon),
      );
      return !_.isEmpty(insideForbiddenArea);
    } else return false;
  };

  const addPoint = (event) => {
    if (!isAddingStartPoint && !isAddingFinishPoint) {
      return;
    }

    const coordinates = event.get('coords');
    const inLocationArea = polygonRef.current?.geometry.contains(coordinates);
    const inForbiddenArea = isPointInForbiddenAreas(coordinates);
    if (inLocationArea && !inForbiddenArea) {
      const point = isAddingStartPoint
        ? { startPoint: coordinates }
        : { finishPoint: coordinates };
      setState({
        ...state,
        ...point,
      });
    }
  };

  const onPointDragEnd = (event) => {
    const markerId = event.get('target').properties.get('id');
    const markerCoordinates = event.get('target').geometry.getCoordinates();
    const inLocationArea =
      polygonRef.current?.geometry.contains(markerCoordinates);
    const inForbiddenArea = isPointInForbiddenAreas(markerCoordinates);
    setState({
      ...state,
      [markerId]: inLocationArea && !inForbiddenArea ? markerCoordinates : [],
    });
  };

  const getStartAndFinishPointProps = () => {
    const locationProps = [];
    if (startPoint.length) {
      locationProps.push(
        getStartMarkerProps({
          coordinates: startPoint,
          draggable: true,
          onDragEnd: onPointDragEnd,
        }),
      );
    }
    if (finishPoint.length) {
      locationProps.push(
        getFinishMarkerProps({
          coordinates: finishPoint,
          draggable: true,
          onDragEnd: onPointDragEnd,
        }),
      );
    }
    return locationProps;
  };

  const onSave = (values, { setSubmitting }) => {
    const { startPoint, finishPoint: finishPointCoordinates } = state;

    setSubmitting(false);
    changeStartDate(values);

    const { coachId, id, name, notes, isPrivate, createdBy } = values;
    const thisIsNotUniqueName = props.competitions.find(
      (el) => el.name === values.name && el.name !== props.competition.name,
    );
    setState({ ...state, isNotUniqueName: thisIsNotUniqueName });

    if (thisIsNotUniqueName) {
      showErrorMessage(NOTIFY_NOT_UNIQUE_COMPETITION_NAME);
      return;
    } else if (!startPoint.length) {
      showErrorMessage(NOTIFY_MAP);
      return;
    }

    const createdCompetition = {
      coachId,
      createdBy,
      finishPoint: finishPointCoordinates.length
        ? finishPointCoordinates
        : startPoint,
      isPrivate,
      location: location,
      name,
      notes,
      startDate: dayjs(values.startDate).format(DATE_FORMATS.DB_NO_TIME_ZONE),
      startPoint,
    };

    const updatedCompetition = {
      coachId,
      finishPoint: finishPointCoordinates.length
        ? finishPointCoordinates
        : startPoint,
      isPrivate,
      location: location,
      notes,
      startPoint,
    };

    urlId
      ? updateCompetition({ ...updatedCompetition, id }).then(({ payload }) =>
          goToNextStep(payload),
        )
      : createCompetition(createdCompetition).then(({ payload }) =>
          goToNextStep(payload),
        );
  };

  const goToNextStep = (response) => {
    if (response.status < 400) {
      navigate(buildSettingsCompetitionByIdUrl(response.data.id));
    }
  };

  const goToAllCompetitions = () => {
    navigate(buildCompetitionUrl());
  };

  if (!props.isLoading && urlId && !competition.name) {
    navigate(buildCreateTimeAndLocationCompetitionUrl());
  }

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

      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={onSave}
        validateOnBlur={false}
        validateOnChange={false}
        validationSchema={competitionValidationSchema}
      >
        {(formikProps) => {
          const { values, handleChange, handleSubmit } = formikProps;
          return (
            <Card variant={'outlined'}>
              <CardContent>
                <Form onSubmit={handleSubmit}>
                  <Grid container direction={'column'} spacing={3}>
                    <Grid item container direction={'column'} spacing={1}>
                      <Grid item>
                        <Typography
                          className="text-black px-2 font-weight-bold"
                          component="div"
                        >
                          Main Information
                        </Typography>
                      </Grid>
                      <Grid item>
                        <FormikInput
                          component={TextField}
                          disabled={!!urlId}
                          enableFeedback
                          fullWidth
                          label={'Name*'}
                          name={'name'}
                          onChange={handleChange}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item>
                        <Field
                          checked={values.isPrivate}
                          component={CheckboxWithLabel}
                          disabled={disabled}
                          id="isPrivate"
                          Label={{ label: 'Sending invitations by coach only' }}
                          name="isPrivate"
                          onChange={handleChange}
                          type="checkbox"
                        />
                      </Grid>
                      <Grid item>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <Field
                            component={DatePickerField}
                            disabled={!!urlId}
                            format={DATE_FORMATS.DATE_PICKER_WITH_TIME}
                            fullWidth
                            inputVariant={'outlined'}
                            keyBoardFormat={
                              DATE_FORMATS.DATE_TIME_COMMON_DISPLAY
                            }
                            label="Date*"
                            minDate={minDate}
                            name={'startDate'}
                            placeholder={DATE_FORMATS.DATE_PICKER_WITH_TIME}
                            variant="inline"
                            withTime
                          />
                        </LocalizationProvider>
                      </Grid>
                      <Grid item>
                        <FormikInput
                          component={TextField}
                          disabled={disabled}
                          enableFeedback
                          fullWidth
                          label={'Notes'}
                          multiline
                          name={'notes'}
                          onChange={handleChange}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item>
                        <FormikInput
                          component={FormikSimpleSelect}
                          disabled={!isUserCoach}
                          enableFeedback
                          fullWidth
                          items={coachesOptions}
                          label={'Trainer*'}
                          name={'coachId'}
                          onChange={handleChange}
                          variant={'outlined'}
                        />
                      </Grid>
                    </Grid>
                    <Grid item container direction={'column'} spacing={2}>
                      <Grid item>
                        <Typography
                          className="text-black px-2 font-weight-bold"
                          component="div"
                        >
                          Location
                        </Typography>
                      </Grid>
                      <Grid item>
                        <FormikInput
                          component={FormikSimpleSelect}
                          disabled={!!urlId}
                          enableFeedback
                          fullWidth
                          items={locationListOnTemplate}
                          label={'Choose location*'}
                          name={'locationId'}
                          onChange={changeStartingCoordinateLocation.bind(
                            null,
                            values,
                            handleChange,
                          )}
                          variant={'outlined'}
                        />
                      </Grid>
                      {state.isMapShown && (
                        <>
                          <Grid item>
                            <Typography
                              className="text-black px-2 font-weight-bold"
                              component="div"
                            >
                              Competition Map*
                            </Typography>
                          </Grid>
                          <Grid item>
                            {!startPoint.length && (
                              <Button
                                color={'secondary'}
                                disabled={disabled}
                                onClick={() =>
                                  setState({
                                    ...state,
                                    isAddingStartPoint: true,
                                    isAddingFinishPoint: false,
                                  })
                                }
                                startIcon={<RoomSharpIcon />}
                                variant={'contained'}
                              >
                                Add start point
                              </Button>
                            )}
                            {!!startPoint.length && !finishPoint.length && (
                              <Button
                                color={'secondary'}
                                disabled={disabled}
                                onClick={() =>
                                  setState({
                                    ...state,
                                    isAddingFinishPoint: true,
                                    isAddingStartPoint: false,
                                  })
                                }
                                startIcon={<RoomSharpIcon />}
                                variant={'contained'}
                              >
                                Add finish point
                              </Button>
                            )}
                          </Grid>
                        </>
                      )}
                      {state.isMapShown && !isLocationLoading && (
                        <Grid item key={location?.id || 'map'}>
                          <LocationMapContainer
                            customMarkers={getStartAndFinishPointProps()}
                            disabled={disabled}
                            forbiddenAreas={location.forbiddenAreas}
                            geometryCenter={{
                              displayMarker: false,
                              coordinates: location.center,
                            }}
                            onMapClick={addPoint}
                            onPolygonClick={addPoint}
                            polygonCoordinates={location.coordinates}
                            setForbiddenAreasRef={(ref) =>
                              (forbiddenAreaRef.current = ref)
                            }
                            setPolygonInstanceRef={(ref) =>
                              (polygonRef.current = ref)
                            }
                            zoomValue={location.zoom}
                          />
                        </Grid>
                      )}
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
                        onClick={goToAllCompetitions}
                        variant="contained"
                      >
                        {urlId ? 'Back' : 'Cancel'}
                      </Button>
                      <Button
                        color="primary"
                        disabled={disabled}
                        type={'submit'}
                        variant="contained"
                      >
                        Next
                      </Button>
                    </Grid>
                  </Grid>
                </Form>
              </CardContent>
            </Card>
          );
        }}
      </Formik>
    </MainLayout>
  );
};

CreateCompetitionTimeAndLocationPage.propTypes = {
  coaches: PropTypes.arrayOf(
    PropTypes.shape({
      firstName: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
      lastName: PropTypes.string,
    }),
  ),
  competition: PropTypes.shape({
    coach: PropTypes.shape({
      firstName: PropTypes.string,
      id: PropTypes.number,
      lastName: PropTypes.string,
    }),
    createdBy: PropTypes.shape({
      firstName: PropTypes.string,
      id: PropTypes.number,
      lastName: PropTypes.string,
    }),
    finishPoint: PropTypes.oneOfType(
      [PropTypes.array, PropTypes.object],
      PropTypes.arrayOf(PropTypes.number),
    ),
    location: PropTypes.shape({
      center: PropTypes.oneOfType(
        [PropTypes.array, PropTypes.object],
        PropTypes.arrayOf(PropTypes.number),
      ),
      coordinates: PropTypes.oneOfType(
        [PropTypes.array, PropTypes.object],
        PropTypes.arrayOf(PropTypes.number),
      ),
      description: PropTypes.string,
      name: PropTypes.string,
      zoom: PropTypes.number,
    }),
    name: PropTypes.string,
    notes: PropTypes.string,
    startDate: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ]),
    startPoint: PropTypes.oneOfType(
      [PropTypes.array, PropTypes.object],
      PropTypes.arrayOf(PropTypes.number),
    ),
    status: PropTypes.string,
  }),
  createCompetition: PropTypes.func.isRequired,
  error: PropTypes.string,
  fetchCompetition: PropTypes.func.isRequired,
  fetchLocations: PropTypes.func.isRequired,
  locations: PropTypes.arrayOf(
    PropTypes.shape({
      center: PropTypes.arrayOf(PropTypes.number),
      coordinates: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
      description: PropTypes.string,
      name: PropTypes.string,
      zoom: PropTypes.number,
    }),
  ).isRequired,
  loggedUser: PropTypes.object.isRequired,
  updateCompetition: PropTypes.func.isRequired,
};

const defaultCompetition = {
  coachId: '',
  createdBy: { firstName: '', lastName: '' },
  finishPoint: [],
  isPrivate: false,
  location: { center: [], coordinates: [], forbiddenAreas: [] },
  locationId: '',
  name: '',
  notes: '',
  startDate: dayjs().add(15, 'minute').toISOString(),
  startPoint: [],
};

const mapStateToProps = createStructuredSelector({
  coaches: selectAllCoaches,
  competition: (state) => selectCompetition(state) || defaultCompetition,
  competitions: selectAllCompetitions,
  error: competitionErrorSelector,
  isLoading: competitionsLoaderSelector,
  isLocationLoading: locationLoaderSelector,
  location: selectLocation,
  locations: selectAllLocations,
  loggedUser: selectLoggedUser,
});

const mapDispatchToProps = (dispatch) => ({
  changeCompetitionDate: (competition, startDate) =>
    dispatch(changeCompetitionDate({ competition, startDate })),
  changeCoordinateLocation: (competition, location) =>
    dispatch(changeCoordinateLocation({ competition, location })),
  createCompetition: (comp) => dispatch(compActions.createCompetition(comp)),
  fetchCompetition: (id) => dispatch(compActions.getCompetitionById(id)),
  fetchCompetitions: () => dispatch(compActions.getCompetitions()),
  fetchLocationById: (id) => dispatch(getLocationById(id)),
  fetchLocations: () => dispatch(getLocations()),
  fetchParticipants: () => dispatch(getParticipants()),
  showErrorMessage: (message) =>
    dispatch(enqueueSnackbar(createErrorMessage(message, dispatch))),
  updateCompetition: (comp) => dispatch(compActions.updateCompetition(comp)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(signInRequired(CreateCompetitionTimeAndLocationPage));
