import '@testing-library/jest-dom/extend-expect';
import '@testing-library/jest-dom';
import React from 'react';
import { screen } from '@testing-library/react';
import ExistingLocationPageTitle from '.';
import { renderWithReduxProvider } from 'src/utils/tests/renderWithReduxProvider';

const userWhoCreated = {
  id: 1,
  email: 'test@gmail.com',
  activated: true,
  firstName: 'Petya',
  lastName: 'Utochkin',
};

const userWhoUpdated = {
  id: 2,
  email: 'test@gmail.com',
  activated: true,
  firstName: 'John',
  lastName: 'Doe',
};

const location = {
  center: [],
  coordinates: [],
  createdBy: userWhoCreated,
  description: '',
  forbiddenAreas: [],
  global: false,
  id: null,
  name: 'Wild forest',
  updatedBy: userWhoUpdated,
  zoom: 10,
  updatedDate: '2020-01-03T09:59:00',
  createdDate: '2022-06-12T15:17:48',
  isFavorite: false,
};

const createdLocation = {
  center: [],
  coordinates: [],
  createdBy: userWhoCreated,
  description: '',
  forbiddenAreas: [],
  global: false,
  id: null,
  name: 'Wild forest',
  zoom: 10,
  createdDate: '2022-06-12T15:17:48',
  isFavorite: false,
};

describe('ExistingLocationPageTitle', () => {
  it('should contain title with location name from props', () => {
    renderWithReduxProvider(
      <ExistingLocationPageTitle
        location={location}
        isFavLocationFeatureEnabled={true}
      />,
    );

    const title = screen.getByText('Location: Wild forest');
    expect(title).toBeInTheDocument();
  });
  it('should contain last modification date of correct format', () => {
    renderWithReduxProvider(
      <ExistingLocationPageTitle
        location={location}
        isFavLocationFeatureEnabled={true}
      />,
    );
    const description = screen.getByText(
      /Last modification: 03\/01\/2020 at 10:59 by/i,
    );
    expect(description).toBeInTheDocument();
  });
  it('should contain name of the user who created location and date of creation if location has not been updated', () => {
    renderWithReduxProvider(
      <ExistingLocationPageTitle
        location={createdLocation}
        isFavLocationFeatureEnabled={true}
      />,
    );
    const name = screen.getByText('Petya Utochkin');
    expect(name).toBeInTheDocument();
    const date = screen.getByText(/12\/06\/2022 at 17:17/i);
    expect(date).toBeInTheDocument();
  });

  it('should contain name of the user who updated location and date of updation if location has been updated', () => {
    renderWithReduxProvider(
      <ExistingLocationPageTitle
        location={location}
        isFavLocationFeatureEnabled={true}
      />,
    );
    const name = screen.getByText('John Doe');
    expect(name).toBeInTheDocument();
    const date = screen.getByText(/03\/01\/2020 at 10:59/i);
    expect(date).toBeInTheDocument();
  });
  it('should contain toggle star icon if the favorite location feature is enabled', () => {
    renderWithReduxProvider(
      <ExistingLocationPageTitle
        location={location}
        isFavLocationFeatureEnabled={true}
      />,
    );
    const toggleIcon = screen.queryByTestId('icon-button');
    expect(toggleIcon).toBeInTheDocument();
  });
  it('should not contain toggle star icon if the favorite location feature is disabled', () => {
    renderWithReduxProvider(
      <ExistingLocationPageTitle
        location={location}
        isFavLocationFeatureEnabled={false}
      />,
    );
    const toggleIcon = screen.queryByTestId('icon-button');
    expect(toggleIcon).not.toBeInTheDocument();
  });
});
