import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import LocationForm from '.';
import * as FeatureTogglesUtils from 'src/featureToggles/FeatureTogglesUtils';
import { location, newLocation, globalLocation } from 'src/utils/tests/mocks';

let mock: any;

beforeEach(() => {
  mock = jest
    .spyOn(FeatureTogglesUtils, 'isFeatureEnabled')
    .mockResolvedValue(true);
});

afterEach(() => {
  mock.mockRestore();
});

const defaultProps = {
  onSave: jest.fn(),
  handleLocationChange: jest.fn(),
  showLocationClonePopUp: jest.fn(),
  showAlertDialog: jest.fn(),
  goToListLocationsPage: jest.fn(),
  showErrorMessage: jest.fn(),
};

const locationFormProps = {
  ...defaultProps,
  location,
  locationState: location,
};

const newLocationFormProps = {
  ...defaultProps,
  location: newLocation,
  locationState: newLocation,
};

const globalLocationFormProps = {
  ...defaultProps,
  location: globalLocation,
  locationState: globalLocation,
};

describe('LocationForm', () => {
  describe('Main Information area', () => {
    it('should contain title, name and description inputs', () => {
      render(<LocationForm {...locationFormProps} />);
      const title = screen.getByText(/Main Information/i);
      expect(title).toBeInTheDocument();
      const nameInput = screen.getByLabelText(/Name/i);
      expect(nameInput).toBeInTheDocument();
      const descriptionInput = screen.getByLabelText(/Description/i);
      expect(descriptionInput).toBeInTheDocument();
    });
  });
  describe('Associated area', () => {
    it('should contain title and a map', () => {
      render(<LocationForm {...locationFormProps} />);
      const title = screen.getByText(/Associated Area/i);
      expect(title).toBeInTheDocument();
      const map = screen.getByTestId('location-map');
      expect(map).toBeInTheDocument();
    });
  });
  describe('ManagementButtons', () => {
    it('should not render any buttons if management is disabled', () => {
      render(<LocationForm {...globalLocationFormProps} />);
      const managementButtons = screen.queryByTestId('management-buttons');
      expect(managementButtons).toBeNull();
    });
    it('should contain only save and cancel buttons if it is a new location page', () => {
      render(<LocationForm {...newLocationFormProps} />);
      const saveButton = screen.getByRole('button', { name: /save/i });
      expect(saveButton).toBeInTheDocument();
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      expect(cancelButton).toBeInTheDocument();
      const deleteButton = screen.queryByRole('button', { name: /delete/i });
      expect(deleteButton).toBeNull();
      const cloneButton = screen.queryByRole('button', { name: /clone/i });
      expect(cloneButton).toBeNull();
    });
    describe('Cancel button', () => {
      it('should call goToListLocationsPage()', () => {
        render(<LocationForm {...newLocationFormProps} />);
        const cancelButton = screen.getByRole('button', { name: /cancel/i });
        fireEvent.click(cancelButton);
        expect(
          newLocationFormProps.goToListLocationsPage,
        ).toHaveBeenCalledTimes(1);
      });
    });
    describe('Delete button', () => {
      it('should call showAlertDialog()', () => {
        render(<LocationForm {...locationFormProps} />);
        const deleteButton = screen.getByRole('button', { name: /delete/i });
        fireEvent.click(deleteButton);
        expect(locationFormProps.showAlertDialog).toHaveBeenCalledTimes(1);
      });
    });
    describe('Clone button', () => {
      it('should call showLocationClonePopUp()', () => {
        render(<LocationForm {...locationFormProps} />);
        const cloneButton = screen.getByRole('button', { name: /clone/i });
        fireEvent.click(cloneButton);
        expect(locationFormProps.showLocationClonePopUp).toHaveBeenCalledTimes(
          1,
        );
      });
    });
  });
  describe('Validation', () => {
    it('should show validation error when trying to submit with empty Name input field', async () => {
      render(<LocationForm {...newLocationFormProps} />);
      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);
      await waitFor(() => {
        const text = screen.getByText(/name is a required field/i);
        expect(text).toBeInTheDocument();
      });
    });
    it('should show validation error if the name is less than 5 charachters', async () => {
      render(<LocationForm {...newLocationFormProps} />);
      const nameInput = screen.getByLabelText(/Name/i);
      fireEvent.input(nameInput, {
        target: {
          value: 'Loca',
        },
      });
      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);
      await waitFor(() => {
        const text = screen.getByText(/name must be at least 5 characters/i);
        expect(text).toBeInTheDocument();
      });
    });
    it('should show validation error if the name is bigger than 50 charachters', async () => {
      render(<LocationForm {...newLocationFormProps} />);
      const nameInput = screen.getByLabelText(/Name/i);
      fireEvent.input(nameInput, {
        target: {
          value: 'Location with aaaaaaaaaa veeeeeeeeeeeeery long name',
        },
      });
      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);
      await waitFor(() => {
        const text = screen.getByText(/name must be at most 50 characters/i);
        expect(text).toBeInTheDocument();
      });
    });
  });
  it('should not allow editing input fields if location is global', () => {
    render(<LocationForm {...globalLocationFormProps} />);
    const nameInput = screen.getByLabelText(/Name/i);
    expect(nameInput).toBeDisabled();
    const descriptionInput = screen.getByLabelText(/Description/i);
    expect(descriptionInput).toBeDisabled();
  });
  it('should contain name and description from location prop as inputs values if location is not new', () => {
    render(<LocationForm {...globalLocationFormProps} />);
    const nameInput = screen.getByLabelText(/Name/i);
    expect(nameInput).toHaveValue('Wild forest');
    const descriptionInput = screen.getByLabelText(/Description/i);
    expect(descriptionInput).toHaveValue('Description of location');
  });
  it('should call submission with changed values', async () => {
    render(<LocationForm {...locationFormProps} />);
    const nameInput = screen.getByLabelText(/Name/i);
    fireEvent.input(nameInput, { target: { value: 'Changed name' } });
    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(locationFormProps.onSave).toBeCalledTimes(1);
      expect(locationFormProps.onSave.mock.calls[0][0]).toStrictEqual({
        ...location,
        name: 'Changed name',
      });
    });
  });
});
