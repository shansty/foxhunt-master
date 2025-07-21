import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { ERRORS } from '../../constants/commonConst';
import Grid from '@mui/material/Grid';
import { TextField } from 'formik-mui';
import { FormikInput } from 'common-front';
import TextEditor from '../TextEditor';
import { EDITOR_TEXT } from '../TextEditor/util/textEditorConstants';
import { topicShape, articleShape } from './propShapes';

const DEFAULT_CONTENT = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
];

const validationSchema = Yup.object().shape({
  title: Yup.string().required(ERRORS.REQUIRED_FIELD).max(50),
  notes: Yup.string(),
});

const getInitialValues = (article) => {
  const initialValues = { ...article };
  !initialValues.contents
    ? (initialValues.contents = JSON.stringify(DEFAULT_CONTENT))
    : (initialValues.contents = JSON.stringify(
        initialValues.contents[EDITOR_TEXT],
      ));
  initialValues.notes = initialValues.notes ?? '';
  return initialValues;
};

const HelpContentForm = ({
  helpContent,
  onSave,
  confirmButtonName,
  renderButtons,
}) => {
  const initialValues = useMemo(
    () => getInitialValues(helpContent),
    [helpContent],
  );

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      onSubmit={onSave}
      validateOnBlur={false}
      validateOnChange={false}
      validationSchema={validationSchema}
    >
      {(formikProps) => {
        const { handleChange, handleSubmit } = formikProps;
        return (
          <>
            <Grid item container direction={'column'} spacing={1}>
              <Grid item>
                <FormikInput
                  enableFeedback
                  fullWidth
                  component={TextField}
                  name="title"
                  label="Title*"
                  variant="outlined"
                  onChange={handleChange}
                />
              </Grid>
              <Grid item>
                <FormikInput
                  fullWidth
                  multiline
                  enableFeedback
                  maxRows={4}
                  component={TextField}
                  name="notes"
                  label="Notes"
                  variant="outlined"
                  onChange={handleChange}
                />
              </Grid>
              <Grid item>
                <FormikInput
                  fullWidth
                  enableFeedback
                  component={TextEditor}
                  name="contents"
                  variant="outlined"
                  initialValue={initialValues.contents}
                />
              </Grid>
            </Grid>
            {renderButtons(handleSubmit, 'Cancel', confirmButtonName)}
          </>
        );
      }}
    </Formik>
  );
};

HelpContentForm.propTypes = {
  helpContent: PropTypes.oneOfType([articleShape, topicShape]),
  onSave: PropTypes.func.isRequired,
  confirmButtonName: PropTypes.string.isRequired,
  renderButtons: PropTypes.func.isRequired,
};

HelpContentForm.defaultProps = {
  helpContent: null,
};

export default HelpContentForm;
