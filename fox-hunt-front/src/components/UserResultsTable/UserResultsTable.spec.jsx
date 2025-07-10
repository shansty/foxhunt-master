// import React from 'react';
// import { render, screen } from '@testing-library/react';
// import '@testing-library/jest-dom';

// import UserResultsTable from './index';

// const config = {
//   color: [
//     { color: '#571cc7', id: 13 },
//     { color: '#bb9add', id: 3 },
//   ],
// };

// const userResults = [
//   {
//     completeCompetition: false,
//     completedOrInGame: true,
//     currentPosition: 1,
//     finishDate: null,
//     foundFoxes: 0,
//     gameTime: -18,
//     isDisconnected: true,
//     startDate: '2022-12-06T09:33:27',
//     startPosition: 1,
//     user: {
//       id: 1,
//       activated: true,
//       email: 'test@gmail.com',
//       firstName: 'Pavel',
//       lastName: 'Pavlov',
//       roles: [],
//     },
//   },
//   {
//     completeCompetition: false,
//     completedOrInGame: true,
//     currentPosition: 2,
//     finishDate: null,
//     foundFoxes: 0,
//     gameTime: -18,
//     isDisconnected: true,
//     startDate: '2022-12-06T09:33:27',
//     startPosition: 1,
//     user: {
//       id: 13,
//       activated: true,
//       email: 'test2@gmail.com',
//       firstName: 'Ivan',
//       lastName: 'Petrov',
//       roles: [],
//     },
//   },
// ];

// describe('HeaderUserBox', () => {
//   it('should render 2 cells with Disconnected label in case of 2 disconnected participants presented', () => {
//     render(<UserResultsTable config={config} userResults={userResults} />);
//     expect(screen.getAllByText('Disconnected')).toHaveLength(2);
//   });

//   it('should render 1 cell with Disconnected label in case of 1 disconnected participant presented', () => {
//     const userResultsOneDisconnected = [...userResults];
//     userResultsOneDisconnected[0].isDisconnected = false;
//     render(
//       <UserResultsTable
//         config={config}
//         userResults={userResultsOneDisconnected}
//       />,
//     );
//     expect(screen.getAllByText('Disconnected')).toHaveLength(1);
//   });

//   it('should not contain cells with Disconnected label in case all participants are active', () => {
//     const userResultsTwoDisconnected = [...userResults];
//     userResultsTwoDisconnected[0].isDisconnected = false;
//     userResultsTwoDisconnected[1].isDisconnected = false;
//     render(
//       <UserResultsTable
//         config={config}
//         userResults={userResultsTwoDisconnected}
//       />,
//     );
//     expect(screen.queryAllByText(/Disconnected/i)).toHaveLength(0);
//   });
// });
