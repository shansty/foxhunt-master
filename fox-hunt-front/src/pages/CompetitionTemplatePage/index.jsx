import React from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { FormikInput } from 'common-front';
import { Button, TextField, Grid } from '@mui/material';
import {
  COMPETITION_NAME_MAX_LENGTH,
  COMPETITION_NAME_MIN_LENGTH,
  ERRORS,
} from 'src/constants/commonConst';
import { signInRequired } from 'src/hocs/permissions';

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
  name: Yup.string()
    .required(ERRORS.REQUIRED_FIELD)
    .min(COMPETITION_NAME_MIN_LENGTH, ERRORS.SHORT_COMPETITION_NAME)
    .max(COMPETITION_NAME_MAX_LENGTH, ERRORS.LONG_COMPETITION_NAME),
});

// TODO pages is used in SidebarMenuButton!
function CompetitionTemplatePage({ submit, cancel }) {
  const onFormSubmit = (values) => {
    submit(values.name);
  };

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={{ name: '' }}
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
                    id={'name'}
                    name={'name'}
                    label={'Competition Name*'}
                    variant={'outlined'}
                    size={'small'}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid
                  item
                  className={'mb-3 mt-3'}
                  style={styles.controlsStyles}
                >
                  <Button
                    variant={'contained'}
                    color={'primary'}
                    type={'submit'}
                  >
                    Generate a template competition
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

export default signInRequired(CompetitionTemplatePage);
