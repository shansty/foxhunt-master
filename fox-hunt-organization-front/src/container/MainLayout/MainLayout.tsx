import React from 'react';

import LeftSidebar from './LeftSidebar/LeftSidebar';
import { Outlet } from 'react-router-dom';

function MainLayout() {
  return (
    <LeftSidebar>
      <div>
        <Outlet />
      </div>
    </LeftSidebar>
  );
}

export default MainLayout;
