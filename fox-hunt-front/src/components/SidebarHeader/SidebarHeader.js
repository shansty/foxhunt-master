import React from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { Box, IconButton, Tooltip } from '@mui/material';
import { connect } from 'react-redux';
import projectLogo from '../../theme/assets/images/fox.svg';
import { setSidebarToggleMobile } from 'src/store/slices/themeOptionsSlice';
import MenuOpenRoundedIcon from '@mui/icons-material/MenuOpenRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import { FOXHUNT_ADMIN_PORTAL } from '../../utils/CommonConstants';
import { createStructuredSelector } from 'reselect';
import { selectSidebarToggleMobile } from '../../store/selectors/mainLayoutSelectors';

function SidebarHeader(props) {
  const toggleSidebarMobile = () => {
    setSidebarToggleMobile(!sidebarToggleMobile);
  };

  const { sidebarToggleMobile, setSidebarToggleMobile } = props;

  return (
    <div className={clsx('app-sidebar-header', {})}>
      <Box className="header-logo-wrapper" title={FOXHUNT_ADMIN_PORTAL}>
        <Link to="/DashboardDefault" className="header-logo-wrapper-link">
          <IconButton
            color="primary"
            size="medium"
            className="header-logo-wrapper-btn"
          >
            <img
              className="app-sidebar-logo"
              alt={FOXHUNT_ADMIN_PORTAL}
              src={projectLogo}
            />
          </IconButton>
        </Link>
        <Box className="header-logo-text">Foxhunt</Box>
      </Box>
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

const mapDispatchToProps = (dispatch) => ({
  setSidebarToggleMobile: (enable) => dispatch(setSidebarToggleMobile(enable)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SidebarHeader);
