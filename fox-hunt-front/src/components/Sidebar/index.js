import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import clsx from 'clsx';
import createNavBar from './NavItems';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { selectFavoriteLocations } from '../../store/selectors/locationsSelectors';
import SidebarMenu from '../SidebarMenu/SidebarMenu';
import { Drawer, Paper, useMediaQuery, useTheme } from '@mui/material';
import SidebarHeader from '../SidebarHeader/SidebarHeader';
import { setSidebarToggleMobile } from 'src/store/slices/themeOptionsSlice';
import { selectUserIsSignedIn } from '../../store/selectors/authSelectors';
import {
  selectSidebarFixed,
  selectSidebarToggleMobile,
} from '../../store/selectors/mainLayoutSelectors';
import { getLocationPackages } from '../../store/actions/locationPackagesActions';
import { selectAllLocationPackages } from '../../store/selectors/locationPackagesSelectors';
import {
  selectAllCurrentCompetitions,
  selectCompetitionTemplates,
} from '../../store/selectors/competitionSelectors';
import { useFeatures } from '@paralleldrive/react-feature-toggles';
import { isFeatureEnabled } from '../../featureToggles/FeatureTogglesUtils';
import { FAVORITE_LOCATION_MANAGEMENT } from '../../featureToggles/featureNameConstants';

function Sidebar({ sidebarShadow }) {
  const sidebarFixed = useSelector(selectSidebarFixed);
  const isSidebarToggledMobile = useSelector(selectSidebarToggleMobile);
  const locationPackages = useSelector(selectAllLocationPackages);
  const favLocations = useSelector(selectFavoriteLocations);
  const currentCompetitions = useSelector(selectAllCurrentCompetitions);
  const isSignedIn = useSelector(selectUserIsSignedIn);
  const competitionsTemplates = useSelector(selectCompetitionTemplates);

  const features = useFeatures();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isSidebarHidden = useMediaQuery(theme.breakpoints.down('lg'));

  const isFavoriteLocationFeatureEnabled = isFeatureEnabled(
    FAVORITE_LOCATION_MANAGEMENT,
  );

  const favoriteLocations = isFavoriteLocationFeatureEnabled
    ? favLocations
    : null;

  const navBar = createNavBar(
    favoriteLocations,
    locationPackages,
    currentCompetitions,
    features,
    competitionsTemplates,
  );

  const closeDrawer = () =>
    dispatch(setSidebarToggleMobile(!isSidebarToggledMobile));

  useEffect(() => {
    if (isSignedIn) {
      dispatch(getLocationPackages());
    }
  }, [isSignedIn, dispatch]);

  const sidebarMenuContent = (
    <div>
      {navBar.map((list) => (
        <SidebarMenu
          component="div"
          key={list.label}
          pages={list.content}
          title={list.label}
        />
      ))}
    </div>
  );

  return (
    <Fragment>
      {isSidebarHidden ? (
        <Drawer
          anchor="left"
          open={isSidebarToggledMobile}
          onClose={closeDrawer}
          variant="temporary"
          elevation={4}
          className="app-sidebar-wrapper-lg"
        >
          <SidebarHeader />
          <PerfectScrollbar>{sidebarMenuContent}</PerfectScrollbar>
        </Drawer>
      ) : (
        <Paper
          className={clsx('app-sidebar-wrapper', {
            'app-sidebar-wrapper-fixed': sidebarFixed,
          })}
          square
          elevation={sidebarShadow ? 11 : 3}
        >
          <SidebarHeader />
          <div
            className={clsx({
              'app-sidebar-menu': sidebarFixed,
            })}
          >
            <PerfectScrollbar options={{ wheelPropagation: false }}>
              {sidebarMenuContent}
            </PerfectScrollbar>
          </div>
        </Paper>
      )}
    </Fragment>
  );
}

Sidebar.propTypes = {
  sidebarShadow: PropTypes.bool,
};

Sidebar.defaultProps = {
  sidebarShadow: false,
};

export default Sidebar;
