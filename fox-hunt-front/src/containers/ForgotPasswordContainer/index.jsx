import React, { useState } from 'react';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Form as FormikForm, Formik } from 'formik';
import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  InputAdornment,
  useMediaQuery,
} from '@mui/material';
import { TextField } from 'formik-mui';
import MailOutline from '@mui/icons-material/MailOutline';
import { ERRORS, EMAIL_REGEX } from '../../constants/commonConst';
import { FormikInput } from 'common-front';
import { sendForgotPasswordRequest } from '../../store/actions/authActions';
import {
  selectUserError,
  selectUserLoadingState,
} from '../../store/selectors/authSelectors';
import PropTypes from 'prop-types';

function ForgotPasswordContainer(props) {
  const [isSubmitButtonVisible, setIsSubmitButtonVisible] = useState(true);
  const matches = useMediaQuery('(min-width:280px)');

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .matches(EMAIL_REGEX, ERRORS.INVALID_EMAIL)
      .required(ERRORS.REQUIRED_FIELD)
      .min(5)
      .max(50),
  });

  function onSubmit(values) {
    const user = {
      email: values.email,
    };
    props.sendForgotPasswordRequest(user);
    setIsSubmitButtonVisible(false);
  }

  return (
    <div>
      <Dialog
        open={props.isOpen}
        onClose={props.handleClickClose}
        aria-labelledby="alert-dialog-title"
      >
        <DialogTitle sx={{ fontSize: (theme) => theme.spacing(2.5) }}>
          <span style={{ fontSize: (theme) => theme.spacing(2.5) }}>
            Forgot password
          </span>
        </DialogTitle>
        <DialogContent>
          <DialogContentText mb={2}>
            Please, enter an email to send reset link:
          </DialogContentText>
          <Formik
            initialValues={{
              email: '',
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
                  label="Email"
                  name={'email'}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MailOutline />
                      </InputAdornment>
                    ),
                  }}
                  enableFeedback={true}
                />
              </FormControl>
              <Grid
                container
                alignItems="center"
                justifyContent={matches ? 'flex-end' : 'center'}
              >
                <Grid item>
                  <Button onClick={props.handleClickClose} color="primary">
                    Cancel
                  </Button>
                </Grid>
                <Grid item>
                  {isSubmitButtonVisible && (
                    <Button type="submit" color="primary">
                      Send reset link
                    </Button>
                  )}
                </Grid>
              </Grid>
            </FormikForm>
          </Formik>
        </DialogContent>
      </Dialog>
    </div>
  );
}

ForgotPasswordContainer.propTypes = {
  error: PropTypes.string,
  isLoading: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  error: selectUserError,
  isLoading: selectUserLoadingState,
});

const mapDispatchToProps = (dispatch) => ({
  sendForgotPasswordRequest: (user) =>
    dispatch(sendForgotPasswordRequest(user)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ForgotPasswordContainer);
