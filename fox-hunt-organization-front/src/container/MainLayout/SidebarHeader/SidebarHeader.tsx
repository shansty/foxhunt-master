import React from 'react';
import { connect } from 'react-redux';

import clsx from 'clsx';

import { Box, IconButton, Tooltip } from '@mui/material';
import { HeaderLogo } from 'common-front';

import { setSidebarToggleMobile } from '../../../store/reducers/themeOptionsReducer';

import MenuOpenRoundedIcon from '@mui/icons-material/MenuOpenRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import { FOXHUNT_ORG_MANAGEMENT_PORTAL } from '../../../utils/commonConstants';
import { createStructuredSelector } from 'reselect';
import { selectSidebarToggleMobile } from '../../../store/selectors/mainLayoutSelectors';

interface SidebarHeaderProps {
  setSidebarToggleMobile: (enable: boolean) => void;
  sidebarToggleMobile: boolean;
}

function SidebarHeader({
  sidebarToggleMobile,
  setSidebarToggleMobile,
}: SidebarHeaderProps) {
  const toggleSidebarMobile = () => {
    setSidebarToggleMobile(!sidebarToggleMobile);
  };

  return (
    <div className={clsx('app-sidebar-header', {})}>
      <HeaderLogo portalName={FOXHUNT_ORG_MANAGEMENT_PORTAL} />
      <Box className="app-sidebar-header-btn-mobile">
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
    </div>
  );
}
const mapStateToProps = createStructuredSelector({
  sidebarToggleMobile: selectSidebarToggleMobile,
});

const mapDispatchToProps = (dispatch: any) => ({
  setSidebarToggleMobile: (enable: boolean) =>
    dispatch(setSidebarToggleMobile(enable)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SidebarHeader);
