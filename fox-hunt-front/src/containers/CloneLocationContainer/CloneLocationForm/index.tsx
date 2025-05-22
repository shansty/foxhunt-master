import React from 'react';
import * as Yup from 'yup';
import { Form as FormikForm, Formik } from 'formik';
import { Button, FormControl, Grid, useMediaQuery } from '@mui/material';
import { TextField } from 'formik-mui';
import { FormikInput } from 'common-front';
import { ERRORS } from 'src/constants/commonConst';
import { Location } from 'src/types/Location';

export interface CloneLocationFormProps {
  onSubmit: (values: any) => void;
  locationToClone: Location;
  handleClickClose: () => void;
}

const CloneLocationForm = ({
  onSubmit,
  locationToClone,
  handleClickClose,
}: CloneLocationFormProps) => {
  const matches = useMediaQuery('(min-width:640px)');
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required(ERRORS.REQUIRED_FIELD)
      .min(5, ERRORS.TOO_SHORT_NAME)
      .max(40, ERRORS.TOO_LONG_NAME)
      .notOneOf([locationToClone.name], ERRORS.LOCATION_ALREADY_EXISTS),
  });

  return (
    <Formik
      initialValues={{
        name: locationToClone?.name?.concat(' (Copy)'),
      }}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      validateOnChange={false}
      validateOnBlur={false}
    >
      <FormikForm>
        <FormControl className="w-100">
          <FormikInput
            component={TextField}
            label="Name"
            name={'name'}
            enableFeedback={true}
          />
        </FormControl>
        <Grid
          container
          alignItems="center"
          justifyContent={matches ? 'flex-end' : 'center'}
        >
          <Grid item>
            <Button onClick={handleClickClose} color="primary">
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button type="submit" color="primary">
              Clone
            </Button>
          </Grid>
        </Grid>
      </FormikForm>
    </Formik>
  );
};

export default CloneLocationForm;
