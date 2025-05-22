import React from 'react';
import UserListPage from './UserListPage';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn().mockReturnValue(jest.fn()),
    useSelector: jest.fn().mockImplementation(() => []),
  };
});

jest.mock(
  '../../component/pagination/CustomTablePagination',
  () => 'mock-child-component',
);

describe('UserListPage', () => {
  it('Renders column headers with name', () => {
    render(<UserListPage />);
    expect(screen.getAllByText('User')).toHaveLength(1);
    expect(screen.getAllByText('User name')).toHaveLength(1);
    expect(screen.getAllByText('Status')).toHaveLength(1);
    expect(screen.getAllByText('Actions')).toHaveLength(1);
  });
});
