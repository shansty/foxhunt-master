import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import {
  selectInvitation,
  selectLoginUrl,
  selectUserInvitationError,
  selectUserInvitationLoadingState,
  selectUserIsSignedIn,
} from 'src/store/selectors/authSelectors';
import 'src/styles/common/_paddings.scss';
import 'src/styles/common/_margins.scss';
import 'src/styles/common/_width.scss';
import {
  userAuthentication,
  getLoginUrl,
  isInvitationValid,
  refreshToken,
  loadLoggedUserInfo,
  setUserInfo,
} from 'src/store/actions/authActions';
import {
  buildSignInUrl,
  buildTokenInvalidUrl,
} from 'src/api/utils/navigationUtil';
import * as FoxHuntPropTypes from 'src/utils/FoxHuntPropTypes';
import { signOutRequired } from 'src/hocs/permissions';
import OuterAppLayout from 'src/layouts/OuterAppLayout';
import RegistrationForm from './RegistrationForm';
import SignUpForm from './SignUpForm';
import illustration from 'src/theme/assets/images/illustrations/invitation-accepted.svg';

function SignUpPage(props) {
  const [isOpenRegistrationForm, setRegistrationFormState] = useState(false);
  const { isInvitationValid, error, isLoading, invitation, loginUrl } = props;

  const navigate = useNavigate();

  useEffect(() => {
    isInvitationValid();
  }, [isInvitationValid]);

  useEffect(() => {
    if (error) navigate(buildTokenInvalidUrl());
  }, [error]);

  async function onSubmit(values) {
    const userInfo = {
      email: invitation.userEntity.email,
      password: values.password,
      firstName: values.firstName,
      lastName: values.lastName,
      city: values.city,
      country: values.country,
    };

    const response = await props.setUserInfo(userInfo);
    if (response instanceof Error) return;

    await props.userAuthentication({
      email: invitation.userEntity.email,
      password: values.password,
      domain: invitation.organizationEntity.organizationDomain,
    });
  }

  function redirectToSignInPage() {
    navigate(buildSignInUrl());
  }

  const title = (
    <>
      Thanks for accepting
      <br /> an invitation to join
      {` ${invitation?.organizationEntity.name}`}!
    </>
  );

  const signUpForm = (
    <>
      {invitation?.userEntity?.activated ? (
        redirectToSignInPage()
      ) : (
        <SignUpForm
          invitation={invitation}
          loginUrl={loginUrl}
          setRegistrationFormState={setRegistrationFormState}
        />
      )}
    </>
  );

  return (
    <>
      {!error && !isLoading && (
        <OuterAppLayout
          title={!isOpenRegistrationForm && title}
          image={illustration}
        >
          {!isOpenRegistrationForm ? (
            signUpForm
          ) : (
            <RegistrationForm
              onSubmit={onSubmit}
              setRegistrationFormState={setRegistrationFormState}
            />
          )}
        </OuterAppLayout>
      )}
    </>
  );
}

SignUpPage.propTypes = {
  invitation: PropTypes.shape({
    userEntity: FoxHuntPropTypes.user.propTypes,
    organizationEntity: FoxHuntPropTypes.organization.propTypes,
  }),
  isInvitationValid: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  loginUrl: PropTypes.string,
  refreshToken: PropTypes.func.isRequired,
};

SignUpPage.defaultProps = {
  invitation: null,
  isLoading: false,
  loginUrl: '',
};

const mapStateToProps = createStructuredSelector({
  invitation: selectInvitation,
  error: selectUserInvitationError,
  isLoading: selectUserInvitationLoadingState,
  isSignedIn: selectUserIsSignedIn,
  loginUrl: selectLoginUrl,
});

const mapDispatchToProps = (dispatch) => ({
  isInvitationValid: () =>
    dispatch(isInvitationValid(window.location.pathname)),
  setUserInfo: (user) => dispatch(setUserInfo(user)),
  getLoginUrl: () => dispatch(getLoginUrl()),
  refreshToken: () => dispatch(refreshToken()),
  userAuthentication: (code) => dispatch(userAuthentication(code)),
  loadLoggedUserInfo: () => dispatch(loadLoggedUserInfo()),
});

export default signOutRequired(
  connect(mapStateToProps, mapDispatchToProps)(SignUpPage),
);
