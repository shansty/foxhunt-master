export const user = {
  id: 1,
  email: 'test@gmail.com',
  activated: true,
  firstName: 'Petya',
  lastName: 'Utochkin',
};

export const location = {
  center: [53.907, 27.567],
  coordinates: [],
  createdBy: user,
  description: '',
  forbiddenAreas: [],
  global: false,
  id: 2,
  updatable: true,
  name: 'Wild forest',
  updatedBy: user,
  zoom: 10,
  updatedDate: '2020-01-03T09:59:00',
  createdDate: '2020-02-03T14:11:00',
  isFavorite: false,
};

export const newLocation = {
  center: [53.907, 27.567],
  coordinates: [],
  createdBy: {
    id: 1,
    email: 'test@gmail.com',
    activated: true,
    firstName: '',
    lastName: '',
  },
  description: '',
  forbiddenAreas: [],
  global: false,
  id: null,
  updatable: true,
  updatedBy: {
    id: 1,
    email: 'test@gmail.com',
    activated: true,
    firstName: '',
    lastName: '',
  },
  zoom: 10,
  isFavorite: false,
};

export const globalLocation = {
  center: [53.907, 27.567],
  coordinates: [],
  createdBy: user,
  description: 'Description of location',
  forbiddenAreas: [],
  global: true,
  id: 1,
  updatable: false,
  name: 'Wild forest',
  zoom: 10,
  createdDate: '2020-02-03T14:11:00',
  isFavorite: false,
};
