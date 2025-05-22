import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import ExistingLocationPageTitle, { ExistingLocationPageTitleProps } from '.';

const user = {
  id: 1,
  activated: true,
  email: 'test@gmail.com',
  firstName: 'Petya',
  lastName: 'Utochkin',
};

const location = {
  center: [],
  coordinates: [],
  createdBy: user,
  description: '',
  forbiddenAreas: [],
  global: false,
  id: null,
  name: 'Wild forest',
  updatedBy: user,
  zoom: 10,
  updatedDate: '2020-01-03T09:59:00',
  createdDate: '2022-06-12T15:17:48',
  isFavorite: false,
};

const favLocation = {
  center: [],
  coordinates: [],
  createdBy: user,
  description: '',
  forbiddenAreas: [],
  global: false,
  id: null,
  name: 'Wild forest',
  updatedBy: user,
  zoom: 10,
  updatedDate: '2020-01-03T09:59:00',
  createdDate: '2022-06-12T15:17:48',
  isFavorite: true,
};

// Maximum 50 characters allowed
const locationWithALongName = {
  center: [],
  coordinates: [],
  createdBy: user,
  description: '',
  forbiddenAreas: [],
  global: false,
  id: null,
  name: 'Location with aaaaaaaaaa veeeeeeeeeeeery long name',
  updatedBy: user,
  zoom: 10,
  updatedDate: '2020-01-03T09:59:00',
  createdDate: '2022-06-12T15:17:48',
  isFavorite: false,
};

export default {
  title: 'ExistingLocationPageTitle',
  component: ExistingLocationPageTitle,
  decorators: [(Story) => <Story />],
} as ComponentMeta<typeof ExistingLocationPageTitle>;

const Template: ComponentStory<typeof ExistingLocationPageTitle> = (
  args: ExistingLocationPageTitleProps,
) => {
  return <ExistingLocationPageTitle {...args} />;
};

export const LocationTitle = Template.bind({});
export const FavoriteLocationTitle = Template.bind({});
export const LocationWithLongName = Template.bind({});

LocationTitle.args = {
  location,
  isFavLocationFeatureEnabled: true,
};

FavoriteLocationTitle.args = {
  location: favLocation,
  isFavLocationFeatureEnabled: true,
};

LocationWithLongName.args = {
  location: locationWithALongName,
  isFavLocationFeatureEnabled: true,
};
