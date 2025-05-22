import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { isEqual } from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, Form, Formik } from 'formik';
import { createStructuredSelector } from 'reselect';
import {
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
  Typography,
  Tabs,
  Tab,
  Box,
} from '@mui/material';
import { CheckboxWithLabel, TextField } from 'formik-mui';
import AlertDialog from 'src/components/AlertDialog';
import LocationMapContainer from 'src/containers/LocationMapContainer';
import { FormikInput, FormikSimpleSelect } from 'common-front';
import * as FoxHuntPropTypes from 'src/utils/FoxHuntPropTypes';
import {
  createLocationPackage,
  getLocationPackageById,
  removeLocationPackage,
  updateLocationPackage,
} from 'src/store/actions/locationPackagesActions';
import { closeLocationPackage } from 'src/store/slices/locationPackagesSlice';
import {
  selectLocationPackage,
  selectLocationPackageLoadingState,
} from 'src/store/selectors/locationPackagesSelectors';
import { locationPackageErrorSelector } from 'src/store/selectors/errorsSelectors';
import { formatDate } from 'src/utils';
import { buildLocationPackageUrl } from 'src/api/utils/navigationUtil';
import {
  DELETE_LOCATION_PACKAGE_TEXT,
  DELETE_LOCATION_PACKAGE_TITLE,
} from 'src/constants/alertConst';
import {
  geoTypeEnum,
  locationPackageCreationTypeEnum,
  locationPackageTypeEnum,
} from 'src/utils/enums';
import {
  NOTIFY_COORDINATES,
  NOTIFY_LOCATION_PACKAGE_TYPE,
  NOTIFY_NOT_SELF_INTERSECTING_POLYGON,
} from 'src/constants/notifyConst';
import LocationTransfer from 'src/containers/CreateLocationPackageMapContainer/LocationTransfer';
import { getLocations } from 'src/store/actions/locationsActions';
import {
  selectAllLocations,
  selectLocationLoadingState,
} from 'src/store/selectors/locationsSelectors';
import noIntersections from 'shamos-hoey';
import { selectCurrentOrganization } from 'src/store/selectors/authSelectors';
import { enqueueSnackbar } from 'src/store/actions/notificationsActions';
import { createErrorMessage } from 'src/utils/notificationUtil';
import { buildNotFoundUrl } from 'src/api/utils/navigationUtil';
import MainLayout from 'src/layouts/MainLayout';
import { signInRequired } from 'src/hocs/permissions';

const styles = {
  associatedLocationsRoot: {
    width: '100%',
    padding: '8px',
  },
  tab: {
    padding: 0,
  },
  tabPanel: {
    width: '100%',
    paddingTop: '10px',
    overflow: 'hidden',
  },
};

const TabPanel = (props) => {
  const { children, value, index } = props;

  return (
    <Box sx={styles.tabPanel} style={{ display: value !== index && 'none' }}>
      {children}
    </Box>
  );
};

const initialFormValues = {
  name: '',
  description: '',
  accessType: '',
  exactAreaMatch: true,
};

const initialState = {
  value: 0,
  isEnabledToDraw: false,
  locationPackageCoordinates: [],
  centerCoordinates: [],
  zoom: 10,
  openAlertDialog: false,
  match: '',
  locations: [],
  assignmentType: locationPackageCreationTypeEnum.LIST_BASED,
};

const CreateLocationPackageMapPage = (props) => {
  const {
    locationPackage,
    fetchLocationPackage,
    fetchLocations,
    closeLocationPackage,
    locations,
    isLocationLoading,
    organization,
    isLocationPackageLoading,
    locationPackageError,
  } = props;
  const [state, setState] = useState(initialState);
  const polygonRef = useRef();
  const navigate = useNavigate();
  const { id: paramsId } = useParams();

  useEffect(() => {
    setState((state) => ({
      ...state,
      locationPackageCoordinates: locationPackage.coordinates,
      centerCoordinates: locationPackage.center,
      zoom: locationPackage.zoom,
      locations: locationPackage.locations,
      assignmentType: locationPackage.assignmentType,
    }));
  }, [locationPackage]);

  useEffect(() => {
    const getLocationPackageData = async () => {
      setState((state) => ({ ...state, match: paramsId }));

      if (paramsId) {
        await fetchLocationPackage(paramsId);
        if (locationPackageError) {
          navigate(buildNotFoundUrl());
        }
        const isListBased =
          locationPackage.assignmentType ===
          locationPackageCreationTypeEnum.LIST_BASED;
        setState((state) => ({
          ...state,
          value: isListBased ? 0 : 1,
          assignmentType: locationPackage.assignmentType,
        }));
      }
      fetchLocations();
    };
    getLocationPackageData();
  }, [
    fetchLocationPackage,
    locationPackage.assignmentType,
    fetchLocations,
    locationPackageError,
  ]);

  useEffect(() => {
    setState((prevState) => {
      if (
        !isEqual(
          locationPackage.coordinates,
          prevState.locationPackageCoordinates,
        ) ||
        !isEqual(locationPackage.center, prevState.centerCoordinates)
      ) {
        return {
          ...prevState,
          locationPackageCoordinates: locationPackage.coordinates,
          centerCoordinates: locationPackage.center,
        };
      }
      return prevState;
    });
  }, [
    fetchLocationPackage,
    locationPackage.coordinates,
    locationPackage.center,
  ]);

  useEffect(() => () => closeLocationPackage(), [closeLocationPackage]);

  const handleChange = (event, newValue) => {
    setState((state) => ({
      ...state,
      value: newValue,
      assignmentType: newValue
        ? locationPackageCreationTypeEnum.AREA_BASED
        : locationPackageCreationTypeEnum.LIST_BASED,
    }));
  };

  const showAlertDialog = () => {
    setState((state) => ({
      ...state,
      openAlertDialog: true,
    }));
  };

  const closeAlertDialog = () => {
    setState((state) => ({
      ...state,
      openAlertDialog: false,
    }));
  };

  const addCenterPoint = (event) => {
    const { isEnabledToDraw, centerCoordinates } = state;
    if (isEnabledToDraw) {
      return;
    }
    const coordinates = event.get('coords');
    if (!isEqual(centerCoordinates, coordinates)) {
      setState((state) => ({
        ...state,
        centerCoordinates: coordinates,
      }));
    }
  };

  const changeZoom = (event) => {
    const zoom = event.get('newZoom');
    if (!isEqual(state.zoom, zoom)) {
      setState((state) => ({ ...state, zoom: zoom }));
    }
  };

  const onCenterPointDragEnd = (event) => {
    const coordinates = event.get('target').geometry.getCoordinates();
    if (!isEqual(state.centerCoordinates, coordinates)) {
      setState((state) => ({ ...state, centerCoordinates: coordinates }));
    }
  };

  const onDrawingStop = (event) => {
    const geometryCoordinates = event
      .get('target')
      .geometry.getCoordinates()[0];
    setState((state) => ({
      ...state,
      locationPackageCoordinates: geometryCoordinates,
      isEnabledToDraw: false,
    }));
    setTimeout(() => {
      polygonRef.current.editor.stopEditing();
    }, 0);
  };

  const toggleDrawState = () => {
    const isEnabled = !polygonRef.current.editor.state.get('drawing');
    if (
      isEnabled &&
      (!locationPackage.locationPackageId || locationPackage.updatable)
    ) {
      polygonRef.current.editor.startDrawing();
      return setState((state) => ({ ...state, isEnabledToDraw: isEnabled }));
    }
    polygonRef.current.editor.stopDrawing();
  };

  const onTrashIconClick = ({ locationPackageId, updatable }) => {
    if (!locationPackageId || updatable) {
      setState((state) => ({ ...state, locationPackageCoordinates: [] }));
    }
  };

  const onSave = (formValues, { setSubmitting }) => {
    setSubmitting(false);
    const {
      locationPackageCoordinates,
      centerCoordinates,
      zoom,
      locations,
      assignmentType,
    } = state;
    const { createLocationPackage, updateLocationPackage, showErrorMessage } =
      props;
    const id = locationPackage.locationPackageId;
    const isAreaBased =
      assignmentType === locationPackageCreationTypeEnum.AREA_BASED;
    const isListBased =
      assignmentType === locationPackageCreationTypeEnum.LIST_BASED;

    if (!organization?.system) {
      formValues.accessType = locationPackageTypeEnum.PRIVATE;
    } else {
      if (formValues.accessType === locationPackageTypeEnum.PRIVATE) {
        showErrorMessage(NOTIFY_LOCATION_PACKAGE_TYPE);
        return;
      }
    }

    const newLocationPackage = {
      ...formValues,
      coordinates: isAreaBased ? locationPackageCoordinates : [],
      center: centerCoordinates,
      zoom: zoom,
      locations: isListBased ? locations : [],
      assignmentType: assignmentType,
      exactAreaMatch: isAreaBased ? formValues.exactAreaMatch : undefined,
    };

    if (isAreaBased) {
      const coordinatesAreSet = locationPackageCoordinates.length > 3;
      if (!coordinatesAreSet) {
        showErrorMessage(NOTIFY_COORDINATES);
        return;
      } else if (!check(locationPackageCoordinates)) {
        showErrorMessage(NOTIFY_NOT_SELF_INTERSECTING_POLYGON);
        return;
      }
    }

    !id
      ? createLocationPackage(newLocationPackage).then(({ payload }) =>
          smoothRedirect(payload),
        )
      : updateLocationPackage(newLocationPackage, id).then(({ payload }) =>
          smoothRedirect(payload),
        );
  };

  const goToListOfObjs = () => {
    navigate(buildLocationPackageUrl());
  };

  const smoothRedirect = (data) =>
    setTimeout(() => {
      if (data.status < 400) {
        goToListOfObjs();
      }
    }, 500);

  const remove = (id) => {
    props.removeLocationPackage(id).then(() => {
      navigate(buildLocationPackageUrl());
    });
  };

  const checkIntersection = (leftList, rightList) => {
    if (!!leftList && !!rightList) {
      return rightList.filter((d) => !leftList.includes(d));
    }
    return [];
  };

  const toLeftList = (leftList, rightList) => {
    if (!!leftList && !!rightList) {
      return leftList.filter(
        (current) =>
          rightList.filter((other) => other.id === current.id).length === 0,
      );
    }
    return [];
  };

  const setLocations = (locations) => {
    setState((state) => ({
      ...state,
      locations: locations,
    }));
  };

  const check = (locationCoordinates) =>
    noIntersections({
      ...FoxHuntPropTypes.geo.defaultProps,
      type: geoTypeEnum.POLYGON,
      coordinates: [locationCoordinates],
    });

  const generatePackageTypes = () => [
    { value: locationPackageTypeEnum.SHARED, label: 'Shared' },
    { value: locationPackageTypeEnum.SYSTEM, label: 'Public' },
    ...(!organization?.system
      ? [{ value: locationPackageTypeEnum.PRIVATE, label: 'Private' }]
      : []),
  ];

  const id = locationPackage.locationPackageId;
  const {
    locationPackageCoordinates,
    centerCoordinates,
    value: selectedTab,
  } = state;
  const isSave = id ? 'Update' : 'Save';
  const updatedAt = locationPackage.updateDate
    ? formatDate(locationPackage.updateDate)
    : formatDate(locationPackage.creationDate);
  const updatedBy = locationPackage.updatedBy
    ? `${locationPackage.updatedBy.firstName} ${locationPackage.updatedBy.lastName}`
    : `${locationPackage.createdBy.firstName} ${locationPackage.createdBy.lastName}`;
  const isUpdatable = !id || locationPackage.updatable;
  const updateDescription = `Last modification: ${updatedAt} by ${updatedBy}`;
  const isUpdate = id ? updateDescription : 'Create a location package';
  const updateTitle = id ? locationPackage.name : 'Location Packages';
  const intersection =
    isLocationLoading || !isUpdate
      ? []
      : checkIntersection(locations, locationPackage.locations);
  let locationsToLeftList = [];
  if (!isLocationLoading) {
    locationsToLeftList =
      id === null
        ? locations
        : toLeftList(locations, locationPackage.locations);
  }

  const isFetchingLocationPackage = paramsId && isLocationPackageLoading && !id;

  return (
    <MainLayout>
      {!isFetchingLocationPackage && (
        <>
          <Paper square elevation={2} className="app-page-title">
            <div>
              <div className="app-page-title--first">
                <div className="app-page-title--heading">
                  <h1>{updateTitle}</h1>
                  <div className="app-page-title--description">{isUpdate}</div>
                </div>
              </div>
            </div>
          </Paper>
          <Formik
            initialValues={
              isUpdate
                ? {
                    name: locationPackage.name,
                    description: locationPackage.description,
                    accessType: locationPackage.accessType,
                    exactAreaMatch:
                      locationPackage.assignmentType ===
                      locationPackageCreationTypeEnum.AREA_BASED
                        ? locationPackage.exactAreaMatch
                        : initialFormValues.exactAreaMatch,
                  }
                : initialFormValues
            }
            onSubmit={onSave}
            validateOnChange={false}
            enableReinitialize
            validationSchema={Yup.object().shape({
              name: Yup.string().required().min(5).max(50),
              description: Yup.string().max(512),
            })}
          >
            {(props) => {
              const { handleSubmit } = props;
              return (
                <Card variant={'outlined'}>
                  <CardContent>
                    <Form onSubmit={handleSubmit}>
                      <Grid container direction={'column'} spacing={1}>
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
                              enableFeedback
                              fullWidth
                              component={TextField}
                              name={'name'}
                              label={'Name*'}
                              variant="outlined"
                              disabled={!isUpdatable}
                            />
                          </Grid>
                        </Grid>
                        <Grid item>
                          <FormikInput
                            enableFeedback
                            fullWidth
                            component={TextField}
                            name={'description'}
                            label={'Description'}
                            variant="outlined"
                            disabled={!isUpdatable}
                          />
                        </Grid>
                        {(organization?.system || !isUpdatable) && (
                          <Grid item>
                            <FormikInput
                              enableFeedback
                              fullWidth
                              component={FormikSimpleSelect}
                              name={'accessType'}
                              items={generatePackageTypes()}
                              label={'Package Type*'}
                              variant={'outlined'}
                              disabled={!isUpdatable}
                            />
                          </Grid>
                        )}
                        {selectedTab === 1 && (
                          <Grid item>
                            <Field
                              component={CheckboxWithLabel}
                              id="exactAreaMatch"
                              name="exactAreaMatch"
                              type="checkbox"
                              Label={{ label: 'Exact area match' }}
                              disabled={!isUpdatable}
                            />
                          </Grid>
                        )}
                        <Tabs
                          value={state.value}
                          onChange={handleChange}
                          indicatorColor="primary"
                          textColor="primary"
                          variant="fullWidth"
                          aria-label="full width tabs example"
                        >
                          <Tab sx={styles.tab} label="List-based Package" />
                          <Tab label="Area-based Package" />
                        </Tabs>
                        <TabPanel value={state.value} index={0}>
                          <Grid
                            item
                            container
                            direction={'column'}
                            alignItems="flex-start"
                          >
                            <Grid sx={styles.associatedLocationsRoot}>
                              {!isLocationLoading && (
                                <LocationTransfer
                                  left={locationsToLeftList}
                                  right={intersection}
                                  isNotPrivate={!isUpdatable}
                                  setLocations={setLocations}
                                />
                              )}
                            </Grid>
                          </Grid>
                        </TabPanel>
                        <TabPanel value={state.value} index={1}>
                          <Grid item container direction={'column'} spacing={1}>
                            <Grid item style={{ maxWidth: '100%' }}>
                              <LocationMapContainer
                                setPolygonInstanceRef={(ref) => {
                                  if (!polygonRef.current) {
                                    polygonRef.current = ref;
                                    polygonRef.current.editor.events.add(
                                      'drawingstop',
                                      onDrawingStop,
                                    );
                                  }
                                }}
                                polygonCoordinates={locationPackageCoordinates}
                                hasLocationDrawingManager={true}
                                zoomValue={locationPackage.zoom}
                                geometryCenter={{
                                  displayMarker: true,
                                  coordinates: centerCoordinates,
                                  onDragEnd: onCenterPointDragEnd,
                                }}
                                onPolygonClick={addCenterPoint}
                                onMapClick={addCenterPoint}
                                onMapBoundsChange={changeZoom}
                                locationDrawingManagerProps={{
                                  isEnabledToDraw: state.isEnabledToDraw,
                                  clickOnDrawManager: toggleDrawState,
                                  onTrashIconClick: () =>
                                    onTrashIconClick(locationPackage),
                                }}
                                forbiddenAreas={[]}
                              />
                            </Grid>
                          </Grid>
                        </TabPanel>
                        <Grid item>
                          {isUpdatable && (
                            <>
                              <Button
                                variant="contained"
                                color="primary"
                                type={'submit'}
                              >
                                {isSave}
                              </Button>
                              <Button
                                variant="contained"
                                color="secondary"
                                onClick={goToListOfObjs}
                              >
                                Cancel
                              </Button>
                              {id !== null && (
                                <Button
                                  variant="contained"
                                  color="primary"
                                  style={{ backgroundColor: '#c9282b' }}
                                  onClick={showAlertDialog}
                                >
                                  Delete
                                </Button>
                              )}
                            </>
                          )}
                        </Grid>
                        <Grid item>
                          <AlertDialog
                            open={state.openAlertDialog}
                            onClose={closeAlertDialog}
                            title={DELETE_LOCATION_PACKAGE_TITLE}
                            text={DELETE_LOCATION_PACKAGE_TEXT}
                            onSubmit={() =>
                              remove(locationPackage.locationPackageId)
                            }
                          />
                        </Grid>
                      </Grid>
                    </Form>
                  </CardContent>
                </Card>
              );
            }}
          </Formik>
        </>
      )}
    </MainLayout>
  );
};

CreateLocationPackageMapPage.propTypes = {
  locationPackage: FoxHuntPropTypes.locationPackage.propTypes,
  organization: PropTypes.object.isRequired,
  error: PropTypes.string,
};

CreateLocationPackageMapPage.defaultProps = {
  locationPackage: FoxHuntPropTypes.locationPackage.defaultProps,
};

const mapStateToProps = createStructuredSelector({
  locationPackage: selectLocationPackage,
  locations: selectAllLocations,
  isLocationLoading: selectLocationLoadingState,
  isLocationPackageLoading: selectLocationPackageLoadingState,
  locationPackageError: locationPackageErrorSelector,
  organization: selectCurrentOrganization,
});

const mapDispatchToProps = (dispatch) => ({
  fetchLocationPackage: (id) => dispatch(getLocationPackageById(id)),
  fetchLocations: () => dispatch(getLocations()),
  createLocationPackage: (locationPackage) =>
    dispatch(createLocationPackage(locationPackage)),
  updateLocationPackage: (locationPackage, id) =>
    dispatch(updateLocationPackage({ locationPackage, id })),
  removeLocationPackage: (id) => dispatch(removeLocationPackage(id)),
  closeLocationPackage: () => dispatch(closeLocationPackage()),
  showErrorMessage: (message) =>
    dispatch(enqueueSnackbar(createErrorMessage(message, dispatch))),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(signInRequired(CreateLocationPackageMapPage));
