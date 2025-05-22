import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import clsx from 'clsx';

import { Footer, Loader } from 'common-front';
import Sidebar from 'src/components/Sidebar';
import Header from 'src/components/Header';

import {
  selectFooterFixed,
  selectSidebarFixed,
  selectSidebarToggleMobile,
} from 'src/store/selectors/mainLayoutSelectors';
import { innerAppLoaderSelector } from 'src/store/selectors/loadersSelector';

import { FOXHUNT_ADMIN_PORTAL } from 'src/utils/CommonConstants';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const footerFixed = useSelector(selectFooterFixed);
  const isUserLoading = useSelector(innerAppLoaderSelector);
  const sidebarFixed = useSelector(selectSidebarFixed);
  const sidebarToggleMobile = useSelector(selectSidebarToggleMobile);

  const contentContainerClasses = useMemo(
    () =>
      clsx('app-content', {
        'app-content-sidebar-collapsed': sidebarToggleMobile,
        'app-content-sidebar-fixed': sidebarFixed,
        'app-content-footer-fixed': footerFixed,
      }),
    [sidebarToggleMobile, sidebarFixed, footerFixed],
  );

  return (
    <Loader isLoading={isUserLoading} size={100}>
      <div className="app-wrapper">
        <Header />
        <div
          className={clsx('app-main', {
            'app-main-sidebar-static': !sidebarFixed,
          })}
        >
          <Sidebar />
          <div className={contentContainerClasses}>
            <div className="app-content--inner">
              <div className="app-content--inner__wrapper">{children}</div>
            </div>
            <Footer
              footerFixed={footerFixed}
              portalName={FOXHUNT_ADMIN_PORTAL}
            />
          </div>
        </div>
      </div>
    </Loader>
  );
};

export default MainLayout;
