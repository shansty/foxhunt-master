import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import HeaderUserBox from './HeaderUserBox';

jest.mock('src/api/utils/getViteEnv', () => ({
  getViteEnv: () => ({
    VITE_GATEWAY_IP: 'localhost',
    VITE_GATEWAY_PORT: '8083',
    VITE_GATEWAY_VERSION: 'v1',
    VITE_GATEWAY_PREFIX: '',
  }),
}));

describe('HeaderUserBox', () => {
  const mockStore = configureMockStore([thunk]);

  const initialState = {
    authReducer: {
      loggedUser: {
        manageMultipleOrganizations: true,
      },
    },
    loadersReducer: {
      loggedUser: {
        loadLoggedUserInfoLoading: false,
      },
    },
  };

  it('should render Switch Organization button in case user manages 2 or more organizations', () => {
    const store = mockStore(initialState);
    render(
      <Provider store={store}>
        <Router>
          <HeaderUserBox />
        </Router>
      </Provider>,
    );
    const switchOrganizationButton = screen.queryByText(/Switch Organization/i);
    expect(switchOrganizationButton).toBeInTheDocument();
  });

  it('should not render Switch Organization button in case user manages only 1 organization', () => {
    const initialStateUserNotManageOrg = { ...initialState };
    initialStateUserNotManageOrg.authReducer.loggedUser.manageMultipleOrganizations = false;
    const store = mockStore(initialStateUserNotManageOrg);
    render(
      <Provider store={store}>
        <Router>
          <HeaderUserBox />
        </Router>
      </Provider>,
    );
    const switchOrganizationButton =
      screen.queryAllByText(/Switch Organization/i);
    expect(switchOrganizationButton).toHaveLength(0);
  });

  it('should not render Switch Organization button in case user does not manage any organization', () => {
    const initialStateUserNotManageOrg = { ...initialState };
    initialStateUserNotManageOrg.authReducer.loggedUser.manageMultipleOrganizations =
      undefined;
    const store = mockStore(initialStateUserNotManageOrg);
    render(
      <Provider store={store}>
        <Router>
          <HeaderUserBox />
        </Router>
      </Provider>,
    );
    const switchOrganizationButton =
      screen.queryAllByText(/Switch Organization/i);
    expect(switchOrganizationButton).toHaveLength(0);
  });
});
