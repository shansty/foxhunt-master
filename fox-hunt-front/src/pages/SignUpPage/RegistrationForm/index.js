import React from 'react';
import { TextField } from 'formik-mui';
import { Button, Grid } from '@mui/material';
import * as Yup from 'yup';
import { Form as FormikForm, Formik } from 'formik';

import { FormikSimpleAutocomplete, FormikInput } from 'common-front';
import { countryNames } from 'src/utils/countryNames';
import {
  ERRORS,
  FIRST_NAME_MIN_LENGTH,
  LAST_NAME_MIN_LENGTH,
  CITY_NAME_MIN_LENGTH,
} from 'src/constants/commonConst';
import { ENGLISH_LETTERS_ONLY_REGEX } from 'src/utils/validators';

const RegistrationForm = ({ setRegistrationFormState, onSubmit }) => {
  const closeRegistrationForm = () => {
    setRegistrationFormState(false);
  };

  const initialValues = {
    password: '',
    repeatedPassword: '',
    firstName: '',
    lastName: '',
    city: '',
    country: '',
  };

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .oneOf([Yup.ref('repeatedPassword'), null], ERRORS.NOT_SAME_PASSWORDS)
      .required(ERRORS.REQUIRED_FIELD),
    repeatedPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], ERRORS.NOT_SAME_PASSWORDS)
      .required(ERRORS.REQUIRED_FIELD),
    firstName: Yup.string()
      .required(ERRORS.REQUIRED_FIELD)
      .min(FIRST_NAME_MIN_LENGTH)
      .max(50)
      .matches(ENGLISH_LETTERS_ONLY_REGEX, ERRORS.ACCEPT_ONLY_LETTERS),
    lastName: Yup.string()
      .required(ERRORS.REQUIRED_FIELD)
      .min(LAST_NAME_MIN_LENGTH)
      .max(50)
      .matches(ENGLISH_LETTERS_ONLY_REGEX, ERRORS.ACCEPT_ONLY_LETTERS),
    city: Yup.string()
      .min(CITY_NAME_MIN_LENGTH)
      .max(255)
      .matches(ENGLISH_LETTERS_ONLY_REGEX, ERRORS.ACCEPT_ONLY_LETTERS),
  });

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      validateOnChange={false}
      validateOnBlur={false}
    >
      <FormikForm>
        <Grid container direction={'column'} spacing={2} sx={{ minWidth: 350 }}>
          <Grid item>
            <p className="text-center font-weight-bold">
              Please, enter your personal information:
            </p>
          </Grid>
          <Grid item>
            <Grid container direction={'column'} spacing={1}>
              <Grid item>
                <FormikInput
                  component={TextField}
                  name={'firstName'}
                  label={'First name'}
                  enableFeedback={true}
                  variant={'outlined'}
                  fullWidth
                />
              </Grid>
              <Grid item>
                <FormikInput
                  component={TextField}
                  name={'lastName'}
                  label={'Last name'}
                  enableFeedback={true}
                  variant={'outlined'}
                  fullWidth
                />
              </Grid>
              <Grid item>
                <FormikInput
                  component={FormikSimpleAutocomplete}
                  name={'country'}
                  options={countryNames}
                  enableFeedback={true}
                  textInputProps={{
                    label: 'Country',
                    variant: 'outlined',
                    fullWidth: true,
                  }}
                />
              </Grid>
              <Grid item>
                <FormikInput
                  component={TextField}
                  name={'city'}
                  label={'City'}
                  enableFeedback={true}
                  variant={'outlined'}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container direction={'column'} spacing={1}>
              <p className="text-center font-weight-bold">
                Set up your password:
              </p>
              <Grid item>
                <FormikInput
                  type={'password'}
                  component={TextField}
                  name={'password'}
                  label={'Enter password'}
                  enableFeedback={true}
                  variant={'outlined'}
                  fullWidth
                />
              </Grid>
              <Grid item>
                <FormikInput
                  type={'password'}
                  component={TextField}
                  name={'repeatedPassword'}
                  label={'Repeat password'}
                  enableFeedback={true}
                  variant={'outlined'}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Grid>
          <div className="text-center">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mb: 1 }}
            >
              Finish registration
            </Button>
          </div>
          <div className="text-center">
            <Button
              onClick={closeRegistrationForm}
              variant="text"
              color="primary"
            >
              Return
            </Button>
          </div>
        </Grid>
      </FormikForm>
    </Formik>
  );
};

export default RegistrationForm;
