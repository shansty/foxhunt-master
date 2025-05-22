import '@testing-library/jest-dom/extend-expect';
import '@testing-library/jest-dom';
import React from 'react';
import { Provider } from 'react-redux';
import { act } from '@testing-library/react';
import { render, screen } from '@testing-library/react';

import store from 'src/store';
import {
  testInvitations,
  testParticipants,
  testLoggedUser,
  testFunction,
  testPromiseFunction,
} from '../testData';
import ListCompetitionInvitationsPage from '..';
import { innerAppLoaderSelector } from 'src/store/selectors/loadersSelector';
import { MemoryRouter } from 'react-router';

export const testCompetition = {
  status: 'SCHEDULED',
  name: 'Test competition',
  createdBy: {
    id: 1,
    firstName: 'Petya',
    lastName: 'Utochkin',
    email: '1123@gmail.com',
  },
  coach: {
    id: 1,
    firstName: 'Petya',
    lastName: 'Utochkin',
    email: '1123@gmail.com',
  },
  participants: [],
  foxAmount: 1,
  foxDuration: 20,
};

jest.mock('src/store/selectors/loadersSelector');

jest.mock('src/hocs/permissions', () => {
  return {
    signInRequired: (Component) => {
      return (props) => {
        return <Component {...props} />;
      };
    },
  };
});

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useParams: () => ({ id: 17 }),
  useHistory: () => ({ push: jest.fn() }),
}));

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    connect: jest
      .fn()
      .mockImplementation(
        (mapStateToProps, mapDispatchToProps) => (ReactComponent) => ({
          mapStateToProps,
          mapDispatchToProps,
          ReactComponent,
        }),
      ),
    Provider: jest.fn().mockImplementation(({ children }) => children),
    useDispatch: () => jest.fn(),
    useSelector: jest.fn().mockImplementation(() => testCompetition),
  };
});

jest.mock('src/layouts/MainLayout', () => 'mock-child-component');

describe('ListCompetitionInvitationsPage', () => {
  const Component = ListCompetitionInvitationsPage.ReactComponent;
  innerAppLoaderSelector.mockReturnValue(() => false);

  beforeEach(
    async () =>
      await act(
        async () =>
          await render(
            <Provider store={store}>
              <Component
                invitations={testInvitations}
                participants={testParticipants}
                loggedUser={testLoggedUser}
                fetchCompetition={testPromiseFunction}
                fetchInvitations={testPromiseFunction}
                fetchParticipants={testPromiseFunction}
                cancelCompetition={testFunction}
                isLoading={false}
                accept={testFunction}
                invite={testFunction}
                decline={testFunction}
                exclude={testFunction}
                permanentlyDecline={testFunction}
              />
            </Provider>,
            {
              wrapper: MemoryRouter,
            },
          ),
      ),
  );

  it('should contain competition name', () => {
    const competitionName = screen.getByText(
      `Competition: ${testCompetition.name}`,
    );
    expect(competitionName).toBeInTheDocument();
  });

  it('should contain creator name', () => {
    const name = screen.getByText(
      `Created by ${testCompetition.createdBy.firstName} ${testCompetition.createdBy.lastName}`,
    );
    expect(name).toBeInTheDocument();
  });

  it('should contain time and location field', () => {
    const filed = screen.getByText('Time and Location');
    expect(filed).toBeInTheDocument();
  });
});
