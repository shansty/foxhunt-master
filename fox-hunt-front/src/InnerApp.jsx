import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';
import {
  selectUserIsSignedIn,
  selectDomain,
} from './store/selectors/authSelectors';
import { FeatureToggles } from '@paralleldrive/react-feature-toggles';
import { loadAvailableFeatures } from './store/actions/featureActions';
import { selectFeatures } from './store/selectors/featureSelector';
import {
  loadLoggedUserInfo,
  loadCurrentOrganization,
} from './store/actions/authActions';
import { getFavoriteLocations } from './store/actions/locationsActions';
import { getCurrentCompetitions } from 'src/store/actions/competitionActions';
import { getLocationPackages } from './store/actions/locationPackagesActions';
import { getAccessToken } from 'src/api/utils/tokenUtils';
import { buildDomainUrl } from 'src/api/utils/navigationUtil';

export function InnerApp() {
  const dispatch = useDispatch();
  const features = useSelector(selectFeatures);
  const domain = useSelector(selectDomain);
  const accessToken = getAccessToken();
  useEffect(() => {
    if (accessToken) {
      dispatch(loadCurrentOrganization());
      dispatch(getCurrentCompetitions());
      dispatch(loadLoggedUserInfo());
      dispatch(getFavoriteLocations());
      dispatch(loadAvailableFeatures());
      dispatch(getLocationPackages());
    }
  }, [dispatch, domain]);
  return accessToken ? (
    <FeatureToggles features={features}>
      <Outlet />
    </FeatureToggles>
  ) : (
    <Navigate to={buildDomainUrl()} replace />
  );
}
