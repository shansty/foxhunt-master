import React from 'react';
import clsx from 'clsx';

import { connect } from 'react-redux';

import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

import { createStructuredSelector } from 'reselect';
import {
  selectFooterFixed,
  selectHeaderFixed,
  selectSidebarFixed,
  selectSidebarToggleMobile,
} from '../../../store/selectors/mainLayoutSelectors';

interface LeftSidebarProps {
  children: React.ReactNode | Element;
  sidebarFixed?: boolean;
  footerFixed?: boolean;
  sidebarToggle?: boolean;
  headerFixed?: boolean;
  sidebarToggleMobile?: boolean;
}

function LeftSidebar(props: LeftSidebarProps) {
  const { children, sidebarToggle, sidebarFixed, footerFixed } = props;

  return (
    <div className={'app-wrapper'}>
      <Header />
      <div
        className={clsx('app-main', {
          'app-main-sidebar-static': !sidebarFixed,
        })}
      >
        <Sidebar />
        <div
          className={clsx('app-content', {
            'app-content-sidebar-collapsed': sidebarToggle,
            'app-content-sidebar-fixed': sidebarFixed,
            'app-content-footer-fixed': footerFixed,
          })}
        >
          <div className="app-content--inner">
            <div className="app-content--inner__wrapper">{children}</div>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = createStructuredSelector({
  sidebarFixed: selectSidebarFixed,
  sidebarToggleMobile: selectSidebarToggleMobile,
  headerFixed: selectHeaderFixed,
  footerFixed: selectFooterFixed,
});

export default connect(mapStateToProps)(LeftSidebar);
