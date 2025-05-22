import React from 'react';

import clsx from 'clsx';

import PerfectScrollbar from 'react-perfect-scrollbar';
import { Drawer, Paper, useMediaQuery, useTheme } from '@mui/material';

import { connect } from 'react-redux';

import SidebarHeader from '../SidebarHeader/SidebarHeader';
import SidebarMenu from '../SidebarMenu/SidebarMenu';

import createNavBar from './NavItems';

import { setSidebarToggleMobile } from '../../../store/reducers/themeOptionsReducer';
import { createStructuredSelector } from 'reselect';
import {
  selectHeaderFixed,
  selectSidebarFixed,
  selectSidebarToggleMobile,
} from '../../../store/selectors/mainLayoutSelectors';

interface SidebarProps {
  sidebarFixed: boolean;
  headerFixed: boolean;
  sidebarShadow?: boolean;
  setSidebarToggleMobile: (enable: boolean) => void;
  sidebarToggleMobile: boolean;
}

function Sidebar(props: SidebarProps) {
  const {
    setSidebarToggleMobile,
    sidebarToggleMobile,
    sidebarFixed,
    sidebarShadow,
  } = props;
  const closeDrawer = () => setSidebarToggleMobile(!sidebarToggleMobile);
  const theme = useTheme();
  const isSidebarHidden = useMediaQuery(theme.breakpoints.down('lg'));

  const navBar = createNavBar();
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
    <>
      {isSidebarHidden ? (
        <Drawer
          anchor="left"
          open={sidebarToggleMobile}
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
    </>
  );
}

const mapStateToProps = createStructuredSelector({
  sidebarFixed: selectSidebarFixed,
  headerFixed: selectHeaderFixed,
  sidebarToggleMobile: selectSidebarToggleMobile,
});

const mapDispatchToProps = (dispatch: any) => ({
  setSidebarToggleMobile: (enable: boolean) =>
    dispatch(setSidebarToggleMobile(enable)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
