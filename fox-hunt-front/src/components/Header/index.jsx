import React from 'react';
import clsx from 'clsx';
import { AppBar, Box, IconButton, Tooltip } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderLogo } from 'common-front';
import MenuOpenRoundedIcon from '@mui/icons-material/MenuOpenRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import { FOXHUNT_ADMIN_PORTAL } from '../../utils/CommonConstants';
import HeaderUserBox from '../HeaderUserBox/HeaderUserBox';
import { selectSidebarToggleMobile } from '../../store/selectors/mainLayoutSelectors';
import { setSidebarToggleMobile } from 'src/store/slices/themeOptionsSlice';

function Header() {
  const sidebarToggleMobile = useSelector(selectSidebarToggleMobile);

  const dispatch = useDispatch();

  const toggleSidebarMobile = () => {
    dispatch(setSidebarToggleMobile(!sidebarToggleMobile));
  };

  return (
    <AppBar
      color="secondary"
      className={clsx('app-header', {})}
      position="fixed"
      elevation={11}
    >
      <HeaderLogo portalName={FOXHUNT_ADMIN_PORTAL} />
      <Box className="app-header-toolbar">
        <Box
          sx={{ display: { lg: 'none', sm: 'block' } }}
          className="app-logo-wrapper"
          title={FOXHUNT_ADMIN_PORTAL}
        >
          <Box
            sx={{ display: { md: 'flex' } }}
            className="d-flex align-items-center"
          />
        </Box>
        <Box
          sx={{ display: { lg: 'flex' } }}
          className="d-flex align-items-center"
        />
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

export default Header;
