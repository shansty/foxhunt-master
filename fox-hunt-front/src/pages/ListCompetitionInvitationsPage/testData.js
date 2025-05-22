export const competitionId = 17;

export const testLoggedUser = {
  activated: true,
  activatedSince: '2020-10-18T16:08:44',
  avatar:
    'https://www.gravatar.com/avatar/0cef98bf1d34a44d088a3c72a612ad28?d=identicon',
  city: 'Minsk',
  completed: false,
  country: 'Belarus',
  dateOfBirth: '2000-02-01T17:25:00',
  email: '1123@gmail.com',
  firstName: 'Petya',
  id: 1,
  lastName: 'Utochkin',
  roles: [
    { organizationId: 1, userId: 1, role: 'ORGANIZATION_ADMIN' },
    { organizationId: 1, userId: 1, role: 'TRAINER' },
  ],
};

export const testInvitations = [
  {
    id: 22,
    competitionId,
    participant: {
      id: 15,
      firstName: 'Nikolai',
      lastName: 'Oleshko',
      dateOfBirth: '2022-11-17T15:18:55.168Z',
      country: 'Belarus',
      city: 'Minsk',
      email: '123@gmail.com',
      roles: [
        {
          organizationId: 5,
          userId: 15,
          role: 'SYSTEM_ADMIN',
        },
      ],
    },
    status: 'PENDING',
    source: '',
  },
];

export const testParticipants = [
  {
    activated: true,
    activatedSince: '2020-10-18T16:08:44',
    avatar: '',
    city: 'Minsk',
    completed: false,
    country: 'Belarus',
    dateOfBirth: '2000-02-01T17:25:00',
    email: '1123@gmail.com',
    firstName: 'Petya',
    id: 5,
    lastName: 'Utochkin',
    roles: [
      { organizationId: 1, userId: 5, role: 'ORGANIZATION_ADMIN' },
      { organizationId: 1, userId: 5, role: 'TRAINER' },
    ],
  },
  {
    activated: true,
    activatedSince: '2020-10-18T16:08:44',
    avatar: '',
    city: 'Minsk',
    completed: false,
    country: 'Belarus',
    dateOfBirth: '2000-02-01T17:25:00',
    email: 'test_participant@mail.com',
    firstName: 'Test',
    id: 6,
    lastName: 'Participant',
    roles: [
      { organizationId: 1, userId: 6, role: 'ORGANIZATION_ADMIN' },
      { organizationId: 1, userId: 6, role: 'TRAINER' },
    ],
  },
];

export const testFunction = jest.fn();
export const testPromiseFunction = jest.fn(() => Promise.resolve());
