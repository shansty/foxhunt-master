// import React from 'react';
// import { Provider } from 'react-redux';
// import configureMockStore from 'redux-mock-store';
// import { BrowserRouter as Router } from 'react-router-dom';
// import { render, screen } from '@testing-library/react';
// import { createMemoryHistory } from 'history';
// import thunk from 'redux-thunk';

// import SignUpPage from './index';

// const mockedNavigate = jest.fn();

// jest.mock('react-router-dom', () => ({
//   ...jest.requireActual('react-router-dom'),
//   useNavigate: () => mockedNavigate,
// }));

// const errorText =
//   /Oops! Something went wrong... Brace yourself till we get error fixed/i;

// describe('SignUpPage', () => {
//   const mockStore = configureMockStore([thunk]);

//   it('should redirect to SignInPage in case user is already activated', async () => {
//     const initialState = {
//       authReducer: {
//         invitation: {
//           userEntity: { activated: true },
//           organizationEntity: { name: 'test' },
//         },
//       },
//     };
//     const store = mockStore(initialState);
//     render(
//       <Provider store={store}>
//         <Router>
//           <SignUpPage />
//         </Router>
//       </Provider>,
//     );
//     expect(screen.queryByText(errorText)).not.toBeInTheDocument();
//     expect(mockedNavigate).toHaveBeenCalledWith('/sign-in');
//   });

//   it('should render SignUpForm in case user is not activated', () => {
//     const initialState = {
//       authReducer: {
//         invitation: {
//           userEntity: { activated: false },
//           organizationEntity: { name: 'test' },
//         },
//       },
//     };
//     const store = mockStore(initialState);
//     render(
//       <Provider store={store}>
//         <Router>
//           <SignUpPage />
//         </Router>
//       </Provider>,
//     );
//     expect(screen.queryAllByText(/Sign up/i)).toHaveLength(2);
//     expect(screen.queryByText(errorText)).not.toBeInTheDocument();
//   });
// });
