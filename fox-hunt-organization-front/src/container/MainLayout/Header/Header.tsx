import React from 'react';

import clsx from 'clsx';

import { AppBar, Box, Hidden, IconButton, Tooltip } from '@mui/material';

import { connect } from 'react-redux';

import { setSidebarToggleMobile } from '../../../store/reducers/themeOptionsReducer';

import { HeaderLogo } from 'common-front';
import HeaderUserBox from '../HeaderUserBox/HeaderUserBox';

import MenuOpenRoundedIcon from '@mui/icons-material/MenuOpenRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import {
  FOXHUNT_ORG_MANAGEMENT,
  FOXHUNT_ORG_MANAGEMENT_PORTAL,
} from '../../../utils/commonConstants';
import { createStructuredSelector } from 'reselect';
import {
  selectHeaderFixed,
  selectHeaderShadow,
  selectSidebarToggleMobile,
} from '../../../store/selectors/mainLayoutSelectors';

interface HeaderProps {
  headerShadow: boolean;
  headerFixed: boolean;
  sidebarToggleMobile: boolean;
  setSidebarToggleMobile: (enable: boolean) => void;
}

function Header(props: HeaderProps) {
  const toggleSidebarMobile = () => {
    setSidebarToggleMobile(!sidebarToggleMobile);
  };
  const {
    headerShadow,
    headerFixed,
    sidebarToggleMobile,
    setSidebarToggleMobile,
  } = props;

  return (
    <AppBar
      color="secondary"
      className={clsx('app-header', {})}
      position={headerFixed ? 'fixed' : 'absolute'}
      elevation={headerShadow ? 11 : 3}
    >
      <HeaderLogo portalName={FOXHUNT_ORG_MANAGEMENT} />
      <Box className="app-header-toolbar">
        <Hidden lgUp>
          <Box
            className="app-logo-wrapper"
            title={FOXHUNT_ORG_MANAGEMENT_PORTAL}
          >
            <Hidden smDown>
              <Box className="d-flex align-items-center"></Box>
            </Hidden>
          </Box>
        </Hidden>
        <Hidden mdDown>
          <Box className="d-flex align-items-center" />
        </Hidden>
        <Box className="d-flex align-items-center">
          <HeaderUserBox />
          <Box className="toggle-sidebar-btn-mobile">
            <Tooltip title="Toggle Sidebar" placement="right">
              <IconButton
                color="inherit"
                onClick={toggleSidebarMobile}
                size="medium"
              >
                {sidebarToggleMobile ? (
                  <MenuOpenRoundedIcon />
                ) : (
                  <MenuRoundedIcon />
                )}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>
    </AppBar>
  );
}

const mapStateToProps = createStructuredSelector({
  headerShadow: selectHeaderFixed,
  headerFixed: selectHeaderShadow,
  sidebarToggleMobile: selectSidebarToggleMobile,
});

const mapDispatchToProps = (dispatch: any) => ({
  setSidebarToggleMobile: (enable: boolean) =>
    dispatch(setSidebarToggleMobile(enable)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
