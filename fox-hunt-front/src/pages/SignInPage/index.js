import React, { useEffect } from 'react';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { Button, FormControl, InputAdornment, SvgIcon } from '@mui/material';
import { TextField } from 'formik-mui';
import MailOutline from '@mui/icons-material/MailOutline';
import LockTwoTone from '@mui/icons-material/LockTwoTone';
import { Form as FormikForm, Formik } from 'formik';

import './styles.scss';
import 'src/styles/common/_paddings.scss';
import { FormikInput } from 'common-front';
import GoogleIcon from 'src/icons/googleIcon';
import { selectLoginUrl } from 'src/store/selectors/authSelectors';
import { userAuthentication, googleUrl } from 'src/store/actions/authActions';
import { ERRORS, EMAIL_REGEX } from 'src/constants/commonConst';
import ForgetPasswordContainer from 'src/containers/ForgotPasswordContainer';
import { setDefaultError } from 'src/store/slices/authSlice';
import { DOMAIN } from 'src/store/constants/localStorageKeys';
import { domainRequired } from 'src/hocs/permissions';
import OuterAppLayout from 'src/layouts/OuterAppLayout';
import illustration from 'src/theme/assets/images/illustrations/login.svg';

const SignInPage = ({ userAuthentication, setDefaultError }) => {
  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .matches(EMAIL_REGEX, ERRORS.INVALID_EMAIL)
      .required(ERRORS.REQUIRED_FIELD)
      .min(5)
      .max(50),
    password: Yup.string().required(ERRORS.REQUIRED_FIELD),
  });

  const onSubmit = (values, { setSubmitting }) => {
    values = { ...values, domain: localStorage.getItem(DOMAIN) };
    userAuthentication(values);
    setSubmitting(false);
  };

  const [openPopUp, setOpenPopUp] = React.useState(false);

  const title = 'Login to your account';
  const description = 'Sign in with credentials';

  const handleClickOpen = () => {
    setOpenPopUp(true);
    setDefaultError();
  };

  const handleClickClose = () => {
    setOpenPopUp(false);
    setDefaultError();
  };

  return (
    <OuterAppLayout
      title={title}
      description={description}
      image={illustration}
    >
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
        validateOnChange={false}
        validateOnBlur={false}
      >
        <FormikForm>
          <FormControl className="w-100 m-2">
            <FormikInput
              enableFeedback
              component={TextField}
              label="Email"
              name={'email'}
              variant="standard"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MailOutline />
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>
          <FormControl className="w-100 m-2">
            <FormikInput
              enableFeedback
              label={'Password'}
              component={TextField}
              type={'password'}
              name={'password'}
              variant="standard"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockTwoTone />
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>
          <div className="text-center">
            <Button
              variant="contained"
              color="primary"
              type="submit"
              sx={{ mr: 1 }}
            >
              Sign in
            </Button>
            <Button
              variant="contained"
              color="grey"
              href={googleUrl}
              rel="noopener noreferrer"
            >
              <SvgIcon sx={{ marginRight: '1rem' }}>
                <GoogleIcon />
              </SvgIcon>
              Sign in with Google
            </Button>
          </div>
          <div className="text-center">
            <Button sx={{ color: 'inherit' }} onClick={handleClickOpen}>
              Forgot password?
            </Button>
          </div>
          {openPopUp && (
            <ForgetPasswordContainer
              isOpen={openPopUp}
              handleClickClose={handleClickClose}
            />
          )}
        </FormikForm>
      </Formik>
    </OuterAppLayout>
  );
};

SignInPage.propTypes = {
  loginUrl: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  loginUrl: selectLoginUrl,
});

const mapDispatchToProps = (dispatch) => ({
  userAuthentication: (code) => dispatch(userAuthentication(code)),
  setDefaultError: () => dispatch(setDefaultError()),
});

export default domainRequired(
  connect(mapStateToProps, mapDispatchToProps)(SignInPage),
);
