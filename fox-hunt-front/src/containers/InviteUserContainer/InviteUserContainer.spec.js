import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from 'src/store';
import InviteUserContainer from './index';

const defaultProps = {
  handleClickClose: jest.fn(),
  pager: { page: 0, rowsPerPage: 10 },
  isOpen: true,
  userRoles: ['TRAINER', 'ORGANIZATION_ADMIN'],
};

describe('User Role Select', () => {
  it('should display role select area', () => {
    render(
      <Provider store={store}>
        <InviteUserContainer {...defaultProps} />
      </Provider>,
    );
    expect(screen.getByTestId('select-area')).toBeInTheDocument();
  });
  it('should display a warning if email and user role are not chosen', () => {
    render(
      <Provider store={store}>
        <InviteUserContainer {...defaultProps} />
      </Provider>,
    );
    fireEvent.click(screen.getByTestId('submit-button'));
    expect(
      screen.getByText('Please, enter one or more emails and choose role'),
    ).toBeInTheDocument();
  });
});
