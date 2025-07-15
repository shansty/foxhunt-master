import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect, useSelector } from 'react-redux';
import _ from 'lodash';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import Button from '@mui/material/Button';
import { Card } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { CheckboxWithLabel } from 'formik-mui';
import { FormikInput, FormikSimpleSelect } from 'common-front';
import {
  getAllCompetitionSteps,
  getCompletedStep,
} from 'src/utils/stepperUtils';

import {
  selectCompetition,
  selectCompetitionLoadingState,
} from 'src/store/selectors/competitionSelectors';
import { competitionErrorSelector } from 'src/store/selectors/errorsSelectors';
import { selectLoggedUser } from 'src/store/selectors/authSelectors';
import { selectDistanceTypes } from 'src/store/selectors/distanceTypeSelectors';
import { fetchDistanceTypes } from 'src/store/actions/distanceTypeActions';
import {
  getCompetitionById,
  updateCompetition,
} from 'src/store/actions/competitionActions';
import { PageTitle } from 'common-front';
import {
  getAllowedCompetitionFrequencies,
  getNumberOfFoxOptions,
} from './utils';
import { STATUS_SCHEDULED } from 'src/constants/competitionStatusConst';
import {
  buildCompetitionInvitationsByIdUrl,
  buildCreateTimeAndLocationCompetitionUrl,
  buildUpdateTimeAndLocationCompetitionByIdUrl,
} from 'src/api/utils/navigationUtil';

import { MAX_FOX_DURATION, MIN_FOX_DURATION } from 'src/constants/commonConst';
import { MAX_FOX_RANGE, MIN_FOX_RANGE } from 'src/constants/commonConst';
import { ERRORS } from 'src/constants/commonConst';
import FormikSlider from 'src/components/UI/FormikSlider/index';
import MainLayout from 'src/layouts/MainLayout';
import { signInRequired } from 'src/hocs/permissions';

const CompetitionSettingPage = (props) => {
  const {
    fetchDistanceTypes,
    fetchCompetition,
    loggedUser,
    updateCompetition,
  } = props;

  const initialState = {
    numberOfFoxOptions: [],
    allowedFrequencies: [],
    createdBy: '',
    coach: '',
    distanceType: '',
    title: '',
    description: '',
    activeStep: 1,
    steps: [],
    completedStep: [],
    disabled: true,
  };

  const [state, setState] = useState(initialState);
  const navigate = useNavigate();
  const { id } = useParams();
  const competition = useSelector((state) => selectCompetition(state, { id }));
  const distanceTypes = useSelector((state) =>
    selectDistanceTypes(state, { id }),
  );

  const initialValues = { ...competition };

  if (competition) {
    if (competition.distanceType) {
      initialValues.distanceTypeId = competition.distanceType.id;
    } else if (!_.isEmpty(distanceTypes)) {
      initialValues.distanceTypeId = distanceTypes[0].id;
    } else {
      initialValues.distanceTypeId = '';
    }
    if (competition.coach) {
      initialValues.coachId = competition.coach.id;
    }
    if (!competition.frequency) {
      initialValues.foxAmount = state.numberOfFoxOptions[0]
        ? state.numberOfFoxOptions[0].value
        : '';
      initialValues.frequency = state.allowedFrequencies[0]
        ? state.allowedFrequencies[0].value
        : '';
      initialValues.foxDuration = MIN_FOX_DURATION;
      initialValues.hasSilenceInterval = false;
      initialValues.foxRange = competition.foxRange || MAX_FOX_RANGE;
    }
  }

  useEffect(() => {
    fetchCompetition(id);
  }, [fetchCompetition]);

  useEffect(() => {
    fetchDistanceTypes();
  }, [fetchDistanceTypes]);

  useEffect(() => {
    if (competition) {
      let numberOfFoxOptions;
      if (!competition.distanceType) {
        numberOfFoxOptions = getNumberOfFoxOptions(
          distanceTypes[0]?.maxNumberOfFox,
        );
      } else {
        numberOfFoxOptions = getNumberOfFoxOptions(
          _.get(competition, ['distanceType', 'maxNumberOfFox']),
        );
      }

      const { createdBy, coach } = competition;
      let { disabled } = state;

      if (id && createdBy.id && coach.id) {
        if (
          (loggedUser.id === createdBy.id || loggedUser.id !== coach.id) &&
          competition.status === STATUS_SCHEDULED
        ) {
          disabled = false;
        }
      }

      setState((state) => ({
        ...state,
        numberOfFoxOptions,
        allowedFrequencies: getAllowedCompetitionFrequencies(),
        title: `Competition: ${competition.name}`,
        description: `Created by ${createdBy.firstName} ${createdBy.lastName}`,
        steps: getAllCompetitionSteps(),
        completedStep: getCompletedStep(competition),
        disabled: disabled,
      }));
    }
  }, [
    getAllowedCompetitionFrequencies,
    getAllCompetitionSteps,
    getCompletedStep,
    distanceTypes,
    competition,
  ]);

  const handleDistanceTypeUpdate = (handleChange, event) => {
    const distanceTypeId = event.target.value;
    const distanceType = distanceTypes.reduce(
      (acc, d) => (`${d.id}` === distanceTypeId.toString() ? d : acc),
      {},
    );
    if (!_.isEmpty(distanceType)) {
      const numberOfFoxOptions = getNumberOfFoxOptions(
        distanceType.maxNumberOfFox,
      );

      setState({ ...state, numberOfFoxOptions });
    }
    handleChange(event);
  };

  const goToTimeAndLocation = () => {
    navigate(buildUpdateTimeAndLocationCompetitionByIdUrl(id));
  };

  const goToNextStep = (response) => {
    if (response.status < 400) {
      navigate(buildCompetitionInvitationsByIdUrl(response.data.id));
    }
  };

  const onSave = (values, { setSubmitting }) => {
    setSubmitting(false);
    const {
      id,
      distanceTypeId,
      foxAmount,
      foxDuration,
      foxRange,
      hasSilenceInterval,
      frequency,
    } = values;
    const updatedCompetition = {
      id,
      distanceType: distanceTypes.find(
        (distanceType) => distanceType.id === +distanceTypeId,
      ),
      foxAmount: +foxAmount,
      foxDuration,
      foxRange,
      hasSilenceInterval,
      frequency,
    };

    updateCompetition(updatedCompetition).then(({ payload }) =>
      goToNextStep(payload),
    );
  };

  if (!props.isLoading && !competition.name) {
    navigate(buildCreateTimeAndLocationCompetitionUrl());
  }

  const { title, description, activeStep, steps, completedStep, disabled } =
    state;

  return (
    <MainLayout>
      {!props.isLoading && (
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

          <Formik
            initialValues={initialValues}
            enableReinitialize
            onSubmit={onSave}
            validateOnBlur={false}
            validateOnChange={false}
            validationSchema={Yup.object().shape({
              distanceTypeId: Yup.string().required(ERRORS.REQUIRED_FIELD),
              foxAmount: Yup.number()
                .required(ERRORS.REQUIRED_FIELD)
                .min(1)
                .max(5),
              frequency: Yup.number().required(ERRORS.REQUIRED_FIELD),
              foxDuration: Yup.number()
                .required(ERRORS.REQUIRED_FIELD)
                .min(20)
                .max(300),
              foxRange: Yup.number()
                .required(ERRORS.REQUIRED_FIELD)
                .min(MIN_FOX_RANGE)
                .max(MAX_FOX_RANGE),
            })}
          >
            {(formikProps) => {
              const {
                values,
                handleChange,
                handleSubmit,
                errors,
                touched,
                setFieldValue,
              } = formikProps;
              return (
                <Card variant={'outlined'}>
                  <CardContent>
                    <Form onSubmit={handleSubmit}>
                      <Grid container direction={'column'} spacing={3}>
                        <Grid
                          item
                          container
                          direction={'row'}
                          spacing={1}
                          justifyContent={'center'}
                        >
                          <Grid
                            item
                            container
                            direction={'column'}
                            sm={4}
                            spacing={3}
                          >
                            <Grid item>
                              <FormikInput
                                disabled={disabled}
                                component={FormikSimpleSelect}
                                name={'distanceTypeId'}
                                items={distanceTypes.map((type) => ({
                                  value: type.id,
                                  label: type.name,
                                }))}
                                label={'DistanceType*'}
                                variant={'outlined'}
                                onChange={handleDistanceTypeUpdate.bind(
                                  null,
                                  handleChange,
                                )}
                                enableFeedback
                                fullWidth
                              />
                            </Grid>
                          </Grid>
                          <Grid
                            item
                            container
                            direction={'column'}
                            sm={4}
                            spacing={1}
                          >
                            <Grid item>
                              <FormikInput
                                disabled={disabled}
                                component={FormikSimpleSelect}
                                name={'foxAmount'}
                                items={state.numberOfFoxOptions}
                                label={'Numbers of Foxes*'}
                                variant={'outlined'}
                                enableFeedback
                                fullWidth
                              />
                            </Grid>
                          </Grid>
                          <Grid
                            item
                            container
                            direction={'column'}
                            sm={4}
                            spacing={1}
                          >
                            <Grid item>
                              <FormikInput
                                disabled={disabled}
                                component={FormikSimpleSelect}
                                name={'frequency'}
                                items={state.allowedFrequencies}
                                label={'Foxes frequency*'}
                                variant={'outlined'}
                                enableFeedback
                                fullWidth
                              />
                            </Grid>
                          </Grid>
                          <Grid item container direction={'column'} spacing={2}>
                            <Grid
                              item
                              container
                              direction={'row'}
                              spacing={1}
                              justifyContent={'center'}
                            >
                              <Grid item>
                                <Typography
                                  className="text-black px-2 font-weight-bold"
                                  component="div"
                                >
                                  Fox time interval (Seconds):
                                </Typography>
                              </Grid>
                            </Grid>
                            <Grid item>
                              <FormikSlider
                                name="foxDuration"
                                disabled={disabled}
                                min={MIN_FOX_DURATION}
                                max={MAX_FOX_DURATION}
                                step={10}
                                value={values.foxDuration}
                                onChange={setFieldValue}
                                isValid={
                                  touched.foxDuration && !errors.foxDuration
                                }
                                isInvalid={errors.foxDuration}
                              />
                            </Grid>
                            <Grid item>
                              <Field
                                disabled={disabled}
                                component={CheckboxWithLabel}
                                id="hasSilenceInterval"
                                type="checkbox"
                                Label={{ label: 'Has silence Interval' }}
                                label="Choose the trainer"
                                checked={values.hasSilenceInterval}
                                onChange={handleChange}
                              />
                            </Grid>
                            <Grid
                              item
                              container
                              direction={'column'}
                              spacing={2}
                            >
                              <Grid
                                item
                                container
                                direction={'row'}
                                spacing={1}
                                justifyContent={'center'}
                              >
                                <Grid item>
                                  <Typography
                                    className="text-black px-2 font-weight-bold"
                                    component="div"
                                  >
                                    Fox range (Meters):
                                  </Typography>
                                </Grid>
                              </Grid>
                              <Grid item>
                                <FormikSlider
                                  name="foxRange"
                                  disabled={disabled}
                                  min={MIN_FOX_RANGE}
                                  max={MAX_FOX_RANGE}
                                  step={10}
                                  value={values.foxRange}
                                  onChange={setFieldValue}
                                  isValid={touched.foxRange && !errors.foxRange}
                                  isInvalid={errors.foxRange}
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid
                          item
                          container
                          direction={'row'}
                          spacing={1}
                          justifyContent={'space-between'}
                        >
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={goToTimeAndLocation}
                          >
                            Back
                          </Button>
                          <Button
                            disabled={disabled}
                            variant="contained"
                            color="primary"
                            type={'submit'}
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
        </>
      )}
    </MainLayout>
  );
};

CompetitionSettingPage.propTypes = {
  error: PropTypes.string,
  fetchDistanceTypes: PropTypes.func.isRequired,
  fetchCompetition: PropTypes.func.isRequired,
  updateCompetition: PropTypes.func.isRequired,
  loggedUser: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  error: competitionErrorSelector,
  loggedUser: selectLoggedUser,
  isLoading: selectCompetitionLoadingState,
});

const mapDispatchToProps = (dispatch) => ({
  fetchDistanceTypes: () => dispatch(fetchDistanceTypes()),
  fetchCompetition: (id) => dispatch(getCompetitionById(id)),
  updateCompetition: (comp) => dispatch(updateCompetition(comp)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(signInRequired(CompetitionSettingPage));
