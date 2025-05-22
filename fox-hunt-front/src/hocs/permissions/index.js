import React, { useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  buildDomainUrl,
  buildWelcomePageUrl,
} from '../../api/utils/navigationUtil';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectUserIsSignedIn,
  selectHasUserParticipantRoleOnly,
  selectUserLoadingState,
} from '../../store/selectors/authSelectors';
import Spinner from '../../components/UI/Spinner';
import { DOMAIN } from '../../store/constants/localStorageKeys';
import { logOut } from '../../store/actions/authActions';
import { getAccessToken } from 'src/api/utils/tokenUtils';

export const domainRequired = (Component) => (props) => {
  const isSignedIn = useSelector(selectUserIsSignedIn);
  const domain = localStorage.getItem(DOMAIN);
  const hasUserParticipantRoleOnly = useSelector(
    selectHasUserParticipantRoleOnly,
  );

  const isDomainEnteredAndUserNotSignedIn = useMemo(
    () => !isSignedIn && domain,
    [isSignedIn, domain],
  );

  const isNotSignedAsParticipant = useMemo(
    () => isSignedIn && !hasUserParticipantRoleOnly,
    [isSignedIn, hasUserParticipantRoleOnly],
  );

  if (isDomainEnteredAndUserNotSignedIn) {
    return <Component {...props} />;
  }
  if (isNotSignedAsParticipant) {
    return <Navigate to={buildWelcomePageUrl()} replace />;
  }
  return <Navigate to={buildDomainUrl()} replace />;
};

export const signInRequired = (Component) => (props) => {
  const isLoading = useSelector(selectUserLoadingState);
  const hasUserParticipantRoleOnly = useSelector(
    selectHasUserParticipantRoleOnly,
  );
  const accessToken = getAccessToken();
  const dispatch = useDispatch();

  useEffect(() => {
    if (hasUserParticipantRoleOnly) {
      dispatch(logOut());
    }
  }, [dispatch, hasUserParticipantRoleOnly]);

  if (isLoading) {
    return <Spinner size={50} />;
  }
  if (hasUserParticipantRoleOnly || !accessToken) {
    return <Navigate to={buildDomainUrl()} replace />;
  }
  return <Component {...props} />;
};

export const signOutRequired = (Component) => (props) => {
  const isSignedIn = useSelector(selectUserIsSignedIn);
  const hasUserParticipantRoleOnly = useSelector(
    selectHasUserParticipantRoleOnly,
  );

  const isSignedAsParticipant = useMemo(
    () => isSignedIn && hasUserParticipantRoleOnly,
    [isSignedIn, hasUserParticipantRoleOnly],
  );

  const isPortalAccessClosed = useMemo(
    () => !isSignedIn || isSignedAsParticipant,
    [isSignedIn, isSignedAsParticipant],
  );

  if (isPortalAccessClosed) {
    return <Component {...props} />;
  }
  if (!isSignedAsParticipant) {
    return <Navigate to={buildWelcomePageUrl()} replace />;
  }
  return <Navigate to={buildDomainUrl()} replace />;
};
