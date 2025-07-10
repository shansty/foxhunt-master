// import React from 'react';
// import { render, screen } from '@testing-library/react';

// import UserProfileForm from '..';

// jest.mock('react-router-dom', () => ({
//   ...jest.requireActual('react-router-dom'),
//   useNavigate: () => jest.fn(),
// }));

// const func = jest.fn();
// const initialValue = {
//   activated: true,
//   roles: [{ role: 'role', id: 'id' }],
// };

// jest.mock('react-redux', () => {
//   return {
//     ...jest.requireActual('react-redux'),
//     useDispatch: () => jest.fn(),
//     useSelector: jest.fn().mockImplementation(() => ({
//       id: 'id',
//       roles: [{ role: 'role' }],
//     })),
//   };
// });

// describe('UserProfileForm', () => {
//   it('should render 2 cells with Not joined label in case if participant is not joined', () => {
//     render(
//       <UserProfileForm
//         avatar=""
//         cancelEditing={func}
//         onSave={func}
//         initialValues={initialValue}
//         isEditButtonVisible={func}
//       />,
//     );
//     expect(screen.getAllByText('Not joined')).toHaveLength(2);
//   });

//   it('should render 2 cells with Inactive label in case if participant is inactive', () => {
//     initialValue.activatedSince = true;
//     initialValue.activated = false;
//     render(
//       <UserProfileForm
//         avatar=""
//         cancelEditing={func}
//         onSave={func}
//         initialValues={initialValue}
//         isEditButtonVisible={func}
//       />,
//     );
//     expect(screen.getAllByText('Inactive')).toHaveLength(2);
//   });

//   it('should render 2 cells with Active label in case if participant active', () => {
//     initialValue.activatedSince = true;
//     initialValue.activated = true;
//     const { container } = render(
//       <UserProfileForm
//         avatar=""
//         cancelEditing={func}
//         onSave={func}
//         initialValues={initialValue}
//         isEditButtonVisible={func}
//       />,
//     );
//     const elem = container.getElementsByClassName('MuiBadge-invisible');
//     expect(elem.length).toBe(1);
//   });
// });
