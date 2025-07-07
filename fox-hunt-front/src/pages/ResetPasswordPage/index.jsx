import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import { createStructuredSelector } from 'reselect';
import { TextField } from 'formik-mui';
import { Form as FormikForm, Formik } from 'formik';
import { Button, FormControl } from '@mui/material';
import { FormikInput } from 'common-front';
import {
  selectResetPasswordRequest,
  selectResetPasswordRequestError,
  selectResetPasswordRequestLoadingState,
} from 'src/store/selectors/authSelectors';
import 'src/styles/common/_paddings.scss';
import 'src/styles/common/_margins.scss';
import 'src/styles/common/_width.scss';
import {
  isResetPasswordLinkValid,
  resetPassword,
} from 'src/store/actions/authActions';
import { ERRORS } from 'src/constants/commonConst';
import NotFoundPage from 'src/pages/errors/NotFoundPage';
import { useParams } from 'react-router-dom';
import { buildDomainUrl } from 'src/api/utils/navigationUtil';
import { signOutRequired } from 'src/hocs/permissions';
import OuterAppLayout from 'src/layouts/OuterAppLayout';
import illustration from 'src/theme/assets/images/illustrations/reset-password.svg';

function ResetPasswordPage({
  resetPasswordRequest,
  resetPassword,
  isResetPasswordLinkValid,
  error,
  isLoading,
}) {
  const { token } = useParams();

  useEffect(() => {
    isResetPasswordLinkValid();
  }, [isResetPasswordLinkValid]);

  const initialValues = {
    password: '',
    repeatedPassword: '',
  };

  const title = 'Reset password';
  const description = 'Set up new password:';

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .oneOf([Yup.ref('repeatedPassword'), null], ERRORS.NOT_SAME_PASSWORDS)
      .required(ERRORS.REQUIRED_FIELD),
    repeatedPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], ERRORS.NOT_SAME_PASSWORDS)
      .required(ERRORS.REQUIRED_FIELD),
  });

  const onSubmit = async (values) => {
    const userInfo = {
      email: resetPasswordRequest.userEmail,
      password: values.password,
    };

    const response = await resetPassword(userInfo, token);
    if (!(response instanceof Error)) {
      window.location = buildDomainUrl();
    }
  };

  return (
    <>
      {error && NotFoundPage()}
      {!error && !isLoading && (
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
                  type={'password'}
                  component={TextField}
                  name={'password'}
                  label={'Enter password'}
                  enableFeedback={true}
                  variant={'outlined'}
                  fullWidth
                />
              </FormControl>
              <FormControl className="w-100 m-2">
                <FormikInput
                  type={'password'}
                  component={TextField}
                  name={'repeatedPassword'}
                  label={'Repeat password'}
                  enableFeedback={true}
                  variant={'outlined'}
                  fullWidth
                />
              </FormControl>
              <div className="text-center">
                <Button type="submit" variant="contained" color="primary">
                  Finish set up
                </Button>
              </div>
            </FormikForm>
          </Formik>
        </OuterAppLayout>
      )}
    </>
  );
}

const mapStateToProps = createStructuredSelector({
  resetPasswordRequest: selectResetPasswordRequest,
  error: selectResetPasswordRequestError,
  isLoading: selectResetPasswordRequestLoadingState,
});

const mapDispatchToProps = (dispatch) => ({
  isResetPasswordLinkValid: () =>
    dispatch(isResetPasswordLinkValid(window.location.pathname)),
  resetPassword: (user, token) => dispatch(resetPassword({ user, token })),
});

export default signOutRequired(
  connect(mapStateToProps, mapDispatchToProps)(ResetPasswordPage),
);
