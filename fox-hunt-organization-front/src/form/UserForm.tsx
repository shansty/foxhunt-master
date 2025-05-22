import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import * as Yup from 'yup';
import dayjs from 'dayjs';
import { Field, Form as FormikForm, Formik } from 'formik';
import { TextField } from 'formik-mui';
import * as userActions from '../store/actions/userActions';
import {
  selectError,
  selectSingleUser,
} from '../store/selectors/userSelectors';
import { FormikInput, FormikSimpleAutocomplete } from 'common-front';
import { Button, Card, CardContent, Grid } from '@mui/material';
import { Alert } from '@mui/lab';
import DatePickerField from '../component/FormikDatePicker';
import {
  LOCAL_DATE_FORMAT,
  REQUIRED_FIELD,
  ACCEPT_ONLY_LETTERS,
  DEFAULT_USER_FORM_VALUES,
  FIRST_NAME_MIN_LENGTH,
  LAST_NAME_MIN_LENGTH,
  CITY_NAME_MIN_LENGTH,
  INVALID_EMAIL,
  EMAIL_REGEX,
} from '../utils/commonConstants';
import { ENGLISH_LETTERS_ONLY_REGEX } from '../utils/validators';
import { countryNames } from '../utils/countryNames';
import { UserFormEnum } from '../utils/enums';
import { User } from '../types/RootUser';
import { UserDispatch } from '../types/Dispatch';

interface UserFormProps {
  createUser(user: User): void;
  error: string | null;
  user?: User;
}

const UserForm = ({ createUser, error }: UserFormProps) => {
  const validationSchema = Yup.object().shape({
    city: Yup.string()
      .min(CITY_NAME_MIN_LENGTH)
      .max(255)
      .matches(ENGLISH_LETTERS_ONLY_REGEX, ACCEPT_ONLY_LETTERS),
    dateOfBirth: Yup.date()
      .typeError('Please enter a valid date')
      .required(REQUIRED_FIELD),
    email: Yup.string()
      .matches(EMAIL_REGEX, INVALID_EMAIL)
      .required(REQUIRED_FIELD),
    firstName: Yup.string()
      .required(REQUIRED_FIELD)
      .min(FIRST_NAME_MIN_LENGTH)
      .max(50)
      .matches(ENGLISH_LETTERS_ONLY_REGEX, ACCEPT_ONLY_LETTERS),
    lastName: Yup.string()
      .required(REQUIRED_FIELD)
      .min(LAST_NAME_MIN_LENGTH)
      .max(50)
      .matches(ENGLISH_LETTERS_ONLY_REGEX, ACCEPT_ONLY_LETTERS),
  });

  const onSubmit = (values: User) => {
    createUser({
      ...values,
      country: values.country,
      dateOfBirth: dayjs(values.dateOfBirth).format(LOCAL_DATE_FORMAT),
    });
  };

  return (
    <Formik
      initialValues={DEFAULT_USER_FORM_VALUES}
      onSubmit={onSubmit}
      validateOnBlur={false}
      validateOnChange={false}
      validationSchema={validationSchema}
    >
      {({ errors, touched }) => (
        <Card variant={'outlined'}>
          <CardContent>
            <FormikForm noValidate>
              <Grid container direction={'column'} spacing={2}>
                <Grid item>
                  <FormikInput
                    component={TextField}
                    enableFeedback
                    fullWidth
                    label={'First name'}
                    name={UserFormEnum.firstName}
                    variant={'outlined'}
                    error={touched.firstName && !!errors.firstName}
                  />
                </Grid>
                <Grid item>
                  <FormikInput
                    component={TextField}
                    enableFeedback
                    fullWidth
                    label={'Last name'}
                    name={UserFormEnum.lastName}
                    variant={'outlined'}
                    error={touched.lastName && !!errors.lastName}
                  />
                </Grid>
                <Grid item>
                  <Field
                    component={DatePickerField}
                    format={'dd/MM/yyyy'}
                    fullWidth
                    inputVariant={'outlined'}
                    label="Date of birth"
                    maxDate={new Date()}
                    name={UserFormEnum.dateOfBirth}
                    placeholder={'dd/mm/yyyy'}
                    variant="inline"
                  />
                </Grid>
                <Grid item>
                  <FormikInput
                    component={FormikSimpleAutocomplete}
                    enableFeedback
                    name={UserFormEnum.country}
                    options={countryNames}
                    textInputProps={{
                      label: 'Country',
                      variant: 'outlined',
                      fullWidth: true,
                    }}
                    error={touched.country && !!errors.country}
                  />
                </Grid>
                <Grid item>
                  <FormikInput
                    component={TextField}
                    enableFeedback
                    fullWidth
                    label={'City'}
                    name={UserFormEnum.city}
                    variant={'outlined'}
                    error={touched.city && !!errors.city}
                  />
                </Grid>
                <Grid item>
                  <FormikInput
                    component={TextField}
                    enableFeedback
                    fullWidth
                    label={'Email'}
                    name={UserFormEnum.email}
                    variant={'outlined'}
                    error={touched.email && !!errors.email}
                  />
                </Grid>
                <Grid item>
                  <Button
                    color={'primary'}
                    fullWidth
                    type={'submit'}
                    variant={'contained'}
                  >
                    Create
                  </Button>
                </Grid>
                <Grid container justifyContent={'center'}>
                  {error && (
                    <Alert style={{ width: 'fit-content' }} severity={'error'}>
                      {error}
                    </Alert>
                  )}
                </Grid>
              </Grid>
            </FormikForm>
          </CardContent>
        </Card>
      )}
    </Formik>
  );
};

const mapStateToProps = createStructuredSelector({
  error: selectError,
  user: selectSingleUser,
});

const mapDispatchToProps = (dispatch: UserDispatch) => ({
  createUser: (user: User) => dispatch(userActions.createUser(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserForm);
