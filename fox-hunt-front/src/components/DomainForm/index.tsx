import React from 'react';
import * as Yup from 'yup';
import { TextField } from 'formik-mui';
import { Button, FormControl, InputAdornment } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import {
  Form as FormikForm,
  Formik,
  FormikHelpers,
  FormikValues,
} from 'formik';

import { FormikInput } from 'common-front';
import { DomainValueType } from 'src/api/utils/domainUtils';

interface DomainFormProps {
  initialValues: DomainValueType;
  submitButtonLabel: string;
  validationSchema: Yup.ObjectSchema<any>;
  onSubmit: (
    values: FormikValues,
    helpers: FormikHelpers<DomainValueType>,
  ) => void;
}
const DomainForm = ({
  onSubmit,
  initialValues,
  validationSchema,
  submitButtonLabel,
}: DomainFormProps) => {
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      validateOnChange={false}
      validateOnBlur={false}
    >
      <FormikForm>
        <FormControl className="w-100 m-1">
          <FormikInput
            component={TextField}
            enableFeedback
            label="Domain"
            name="domain"
            variant="standard"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <HomeIcon />
                </InputAdornment>
              ),
            }}
          />
        </FormControl>
        <div className="text-center">
          <Button variant="contained" color="primary" type="submit">
            {submitButtonLabel}
          </Button>
        </div>
      </FormikForm>
    </Formik>
  );
};

export default DomainForm;
