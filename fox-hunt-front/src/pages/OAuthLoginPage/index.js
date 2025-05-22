import React, { useEffect } from 'react';
import {
  selectUserError,
  selectUserIsSignedIn,
} from 'src/store/selectors/authSelectors';
import { getTokens } from 'src/store/actions/authActions';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import * as localStorageKeys from 'src/store/constants/localStorageKeys';
import { loadAvailableFeatures } from 'src/store/actions/featureActions';
import Spinner from 'src//components/UI/Spinner';
import {
  buildWelcomePageUrl,
  buildDomainUrl,
} from 'src/api/utils/navigationUtil';

function OAuthLoginPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const isSignedIn = useSelector(selectUserIsSignedIn);
  const error = useSelector(selectUserError);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const domain = localStorage.getItem(localStorageKeys.DOMAIN);
    dispatch(getTokens({ code, domain })).then(() => {
      dispatch(loadAvailableFeatures());
    });
  }, [location.search, dispatch]);

  if (isSignedIn) {
    return <Navigate to={buildWelcomePageUrl()} replace />;
  }
  if (error) {
    return <Navigate to={buildDomainUrl()} replace />;
  }
  return <Spinner size={50} />;
}

export default OAuthLoginPage;
