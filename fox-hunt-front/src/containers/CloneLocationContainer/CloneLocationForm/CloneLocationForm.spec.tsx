import '@testing-library/jest-dom';
import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { location } from 'src/utils/tests/mocks';
import CloneLocationForm from '.';

const cloneLocation = jest.fn();
const handleClickClose = jest.fn();

describe('CloneLocationForm', () => {
  beforeEach(() => jest.resetAllMocks());
  it('should contain input with the initial name value', () => {
    render(
      <CloneLocationForm
        onSubmit={cloneLocation}
        locationToClone={location}
        handleClickClose={handleClickClose}
      />,
    );

    const nameInput = screen.getByLabelText(/Name/i);
    expect(nameInput).toHaveValue('Wild forest (Copy)');
  });
  it('should contain Cancel and Clone buttons', () => {
    render(
      <CloneLocationForm
        onSubmit={cloneLocation}
        locationToClone={location}
        handleClickClose={handleClickClose}
      />,
    );
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    expect(cancelButton).toBeInTheDocument();
    const cloneButton = screen.getByRole('button', { name: /clone/i });
    expect(cloneButton).toBeInTheDocument();
  });
  it('should highlight input when trying to submit with empty field', async () => {
    render(
      <CloneLocationForm
        onSubmit={cloneLocation}
        locationToClone={location}
        handleClickClose={handleClickClose}
      />,
    );
    const nameInput = screen.getByLabelText(/Name/i);
    fireEvent.input(nameInput, { target: { value: '' } });
    const cloneButton = screen.getByRole('button', { name: /clone/i });
    fireEvent.click(cloneButton);
    await waitFor(() => {
      const text = screen.getByText(/This field is required/i);
      expect(text).toBeInTheDocument();
    });
  });
  it('should call cloneLocation() after clicking Clone button', async () => {
    render(
      <CloneLocationForm
        onSubmit={cloneLocation}
        locationToClone={location}
        handleClickClose={handleClickClose}
      />,
    );
    const cloneButton = screen.getByRole('button', { name: /Clone/i });
    fireEvent.click(cloneButton);
    await waitFor(() => {
      expect(cloneLocation).toHaveBeenCalledTimes(1);
    });
  });
  it('should call submission with given values', async () => {
    render(
      <CloneLocationForm
        onSubmit={cloneLocation}
        locationToClone={location}
        handleClickClose={handleClickClose}
      />,
    );
    const nameInput = screen.getByLabelText(/Name/i);
    fireEvent.input(nameInput, { target: { value: 'New Location' } });
    const cloneButton = screen.getByRole('button', { name: /Clone/i });
    fireEvent.click(cloneButton);
    await waitFor(() => {
      expect(cloneLocation.mock.calls[0][0]).toStrictEqual({
        name: 'New Location',
      });
    });
  });
  it('should call handleClickClose() after clicking Cancel button', async () => {
    render(
      <CloneLocationForm
        onSubmit={cloneLocation}
        locationToClone={location}
        handleClickClose={handleClickClose}
      />,
    );
    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelButton);
    expect(handleClickClose).toHaveBeenCalledTimes(1);
  });
});
