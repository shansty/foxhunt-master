import { Form as FormikForm, Formik, FormikHelpers } from 'formik';
import {
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputAdornment,
} from '@mui/material';
import { Alert } from '@mui/material';
import React from 'react';
import * as Yup from 'yup';
import {
  REQUIRED_FIELD,
  DEFAULT_LOGIN_FORM_VALUES,
  INVALID_EMAIL,
  EMAIL_REGEX,
} from '../../utils/commonConstants';
import { createStructuredSelector } from 'reselect';
import * as authActions from '../../store/actions/authActions';
import { connect } from 'react-redux';
import { selectError } from '../../store/selectors/authSelector';
import MailOutline from '@mui/icons-material/MailOutline';
import LockTwoTone from '@mui/icons-material/LockTwoTone';
import { FormikInput } from 'common-front';
import illustration from '../../theme/assets/images/illustrations/login.svg';
import { TextField } from 'formik-mui';
import './styles.scss';
import { SignInUser } from '../../types/SignInUser';
import { AuthDispatch } from '../../types/Dispatch';

interface LoginPageProps {
  error: string | null;
  logIn: (values: SignInUser) => void;
}

function LoginPage(props: LoginPageProps) {
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required(REQUIRED_FIELD)
      .min(5)
      .max(50)
      .matches(EMAIL_REGEX, INVALID_EMAIL),
    password: Yup.string().required(REQUIRED_FIELD),
  });

  function onSubmit(
    values: SignInUser,
    { setSubmitting }: FormikHelpers<SignInUser>,
  ) {
    const { logIn } = props;
    logIn(values);
    setSubmitting(false);
  }

  return (
    <Formik
      initialValues={DEFAULT_LOGIN_FORM_VALUES}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      validateOnChange={false}
      validateOnBlur={false}
    >
      <FormikForm>
        <Grid
          container
          spacing={3}
          direction={'row'}
          justifyContent={'center'}
          alignItems={'center'}
          style={{ minHeight: '100vh' }}
        >
          <Grid item id={'illustration'}>
            <img alt="Login" src={illustration} />
          </Grid>
          <Grid item>
            <h1 className="display-3 mb-3 text-center font-weight-bold">
              Login to your account
            </h1>
            <Card>
              <CardContent>
                <div className="card-body px-lg-5">
                  <div className="text-center text-muted mb-4">
                    <span>Sign in with credentials</span>
                  </div>
                  <FormControl className="w-100 m-2">
                    <FormikInput
                      component={TextField}
                      label="Email"
                      name="email"
                      variant="standard"
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
                  <FormControl className="w-100 m-2">
                    <FormikInput
                      label={'Password'}
                      component={TextField}
                      type={'password'}
                      name="password"
                      variant="standard"
                      enableFeedback={true}
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
                    <Button variant="contained" color="primary" type="submit">
                      Sign in
                    </Button>
                  </div>
                  <Grid container justifyContent={'center'}>
                    {props.error && (
                      <Alert
                        style={{ width: 'fit-content', marginTop: '30px' }}
                        severity={'error'}
                      >
                        {props.error}
                      </Alert>
                    )}
                  </Grid>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </FormikForm>
    </Formik>
  );
}

const mapStateToProps = createStructuredSelector({
  error: selectError,
});

const mapDispatchToProps = (dispatch: AuthDispatch) => ({
  logIn: (credentials: SignInUser) =>
    dispatch(authActions.requestToken(credentials)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
