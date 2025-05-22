import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import InnerAppRoutes from 'src/routes/InnerAppRoutes';
import store from 'src/store';

export const renderWithRouter = (component: React.ReactChild) => {
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <InnerAppRoutes />
        {component}
      </MemoryRouter>
    </Provider>,
  );
};
