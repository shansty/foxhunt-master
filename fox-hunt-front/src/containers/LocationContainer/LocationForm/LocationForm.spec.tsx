// import React from 'react';
// import { fireEvent, render, screen, waitFor } from '@testing-library/react';
// import LocationForm from '.';
// import * as FeatureTogglesUtils from 'src/featureToggles/FeatureTogglesUtils';
// import { location, newLocation, globalLocation } from 'src/utils/tests/mocks';

// let mock: jest.SpyInstance;

// beforeEach(() => {
//   mock = jest
//     .spyOn(FeatureTogglesUtils, 'isFeatureEnabled')
//     .mockResolvedValue(true);
// });

// afterEach(() => {
//   mock.mockRestore();
//   jest.clearAllMocks();
// });

// const defaultProps = {
//   onSave: jest.fn((values, { setSubmitting }) => {
//     setSubmitting(false);
//   }),
//   handleLocationChange: jest.fn(),
//   showLocationClonePopUp: jest.fn(),
//   showAlertDialog: jest.fn(),
//   goToListLocationsPage: jest.fn(),
//   showErrorMessage: jest.fn(),
// };

// const locationFormProps = {
//   ...defaultProps,
//   location,
//   locationState: location,
// };

// const newLocationFormProps = {
//   ...defaultProps,
//   location: newLocation,
//   locationState: newLocation,
// };

// const globalLocationFormProps = {
//   ...defaultProps,
//   location: globalLocation,
//   locationState: globalLocation,
// };

// describe('LocationForm', () => {
//   describe('Main Information area', () => {
//     it('should contain title, name and description inputs', () => {
//       render(<LocationForm {...locationFormProps} />);
//       expect(screen.getByText(/Main Information/i)).toBeInTheDocument();
//       expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
//       expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
//     });
//   });

//   describe('Associated area', () => {
//     it('should contain title and a map', () => {
//       render(<LocationForm {...locationFormProps} />);
//       expect(screen.getByText(/Associated Area/i)).toBeInTheDocument();
//       expect(screen.getByTestId('location-map')).toBeInTheDocument();
//     });
//   });

//   describe('ManagementButtons', () => {
//     it('should not render buttons if management is disabled (global location)', () => {
//       render(<LocationForm {...globalLocationFormProps} />);
//       expect(screen.queryByTestId('management-buttons')).toBeNull();
//     });

//     it('should show only save and cancel buttons on new location', () => {
//       render(<LocationForm {...newLocationFormProps} />);
//       expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
//       expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
//       expect(screen.queryByRole('button', { name: /delete/i })).toBeNull();
//       expect(screen.queryByRole('button', { name: /clone/i })).toBeNull();
//     });

//     describe('Cancel button', () => {
//       it('should call goToListLocationsPage()', () => {
//         render(<LocationForm {...newLocationFormProps} />);
//         fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
//         expect(defaultProps.goToListLocationsPage).toHaveBeenCalledTimes(1);
//       });
//     });

//     describe('Delete button', () => {
//       it('should call showAlertDialog()', () => {
//         render(<LocationForm {...locationFormProps} />);
//         fireEvent.click(screen.getByRole('button', { name: /delete/i }));
//         expect(defaultProps.showAlertDialog).toHaveBeenCalledTimes(1);
//       });
//     });

//     describe('Clone button', () => {
//       it('should call showLocationClonePopUp()', () => {
//         render(<LocationForm {...locationFormProps} />);
//         fireEvent.click(screen.getByRole('button', { name: /clone/i }));
//         expect(defaultProps.showLocationClonePopUp).toHaveBeenCalledTimes(1);
//       });
//     });
//   });

//   describe('Validation', () => {
//     it('should show error when submitting with empty name', async () => {
//       render(<LocationForm {...newLocationFormProps} />);
//       fireEvent.click(screen.getByRole('button', { name: /save/i }));
//       expect(await screen.findByText(/name is a required field/i)).toBeInTheDocument();
//     });

//     it('should show error when name is less than 5 characters', async () => {
//       render(<LocationForm {...newLocationFormProps} />);
//       fireEvent.change(screen.getByLabelText(/Name/i), {
//         target: { value: 'Abc' },
//       });
//       fireEvent.click(screen.getByRole('button', { name: /save/i }));
//       expect(await screen.findByText(/name must be at least 5 characters/i)).toBeInTheDocument();
//     });

//     it('should show error when name is more than 50 characters', async () => {
//       render(<LocationForm {...newLocationFormProps} />);
//       fireEvent.change(screen.getByLabelText(/Name/i), {
//         target: { value: 'A'.repeat(51) },
//       });
//       fireEvent.click(screen.getByRole('button', { name: /save/i }));
//       expect(await screen.findByText(/name must be at most 50 characters/i)).toBeInTheDocument();
//     });
//   });

//   it('should not allow editing fields if location is global', () => {
//     render(<LocationForm {...globalLocationFormProps} />);
//     expect(screen.getByLabelText(/Name/i)).toBeDisabled();
//     expect(screen.getByLabelText(/Description/i)).toBeDisabled();
//   });

//   it('should display existing location values', () => {
//     render(<LocationForm {...globalLocationFormProps} />);
//     expect(screen.getByLabelText(/Name/i)).toHaveValue('Wild forest');
//     expect(screen.getByLabelText(/Description/i)).toHaveValue('Description of location');
//   });

//   it('should call onSave with updated name on submit', async () => {
//     render(<LocationForm {...locationFormProps} />);
//     fireEvent.change(screen.getByLabelText(/Name/i), {
//       target: { value: 'Changed name' },
//     });
//     fireEvent.click(screen.getByRole('button', { name: /save/i }));

//     await waitFor(() => {
//       expect(defaultProps.onSave).toHaveBeenCalledTimes(1);
//       expect(defaultProps.onSave).toHaveBeenCalledWith(
//         expect.objectContaining({
//           ...location,
//           name: 'Changed name',
//         }),
//         expect.any(Object) // Formik bag
//       );
//     });
//   });
// });
