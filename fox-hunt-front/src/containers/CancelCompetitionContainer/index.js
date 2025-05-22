import React from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { FormikInput } from 'common-front';
import { Button, TextField, Grid } from '@mui/material';
import {
  COMPETITION_NAME_MIN_LENGTH,
  COMPETITION_NOTES_MAX_LENGTH,
  ERRORS,
} from '../../constants/commonConst';

const styles = {
  controlsStyles: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '5px',
    flexWrap: 'wrap',
  },
  formStyles: {
    width: '100%',
  },
};

const competitionNameValidationSchema = Yup.object().shape({
  reason: Yup.string()
    .required(ERRORS.REQUIRED_FIELD)
    .min(COMPETITION_NAME_MIN_LENGTH, ERRORS.SHORT_COMPETITION_NAME)
    .max(COMPETITION_NOTES_MAX_LENGTH, ERRORS.LONG_COMPETITION_NAME),
});

function CancelCompetitionContainer({ submit, cancel }) {
  const onFormSubmit = (values) => {
    submit(values);
  };

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={{ reason: '' }}
        validateOnBlur={false}
        validateOnChange={false}
        onSubmit={onFormSubmit}
        validationSchema={competitionNameValidationSchema}
      >
        {(formikProps) => {
          const { handleChange, handleSubmit } = formikProps;
          return (
            <Grid container>
              <Form style={styles.formStyles} onSubmit={handleSubmit}>
                <Grid item>
                  <FormikInput
                    enableFeedback
                    fullWidth
                    component={TextField}
                    id={'reason'}
                    name={'reason'}
                    label={'Reason'}
                    variant={'outlined'}
                    size={'small'}
                    onChange={handleChange}
                    multiline
                    rows={3}
                  />
                </Grid>
                <Grid item className={'mt-3'} style={styles.controlsStyles}>
                  <Button
                    variant={'contained'}
                    color={'primary'}
                    type={'submit'}
                  >
                    Cancel competition
                  </Button>
                  <Button
                    variant={'contained'}
                    color={'secondary'}
                    onClick={cancel}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Form>
            </Grid>
          );
        }}
      </Formik>
    </>
  );
}

export default CancelCompetitionContainer;
