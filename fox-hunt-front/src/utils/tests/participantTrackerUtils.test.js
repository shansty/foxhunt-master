import { getParticipantMarkerPropsFromTracker } from '../markers';
import variables from '../styles/_variables.scss';

const participantTracker = {
  participant: {
    activated: true,
    activatedSince: '2020-10-04T20:54:20',
    city: 'Minsk',
    color: '#c9fb7e',
    completed: false,
    country: 'Belarus',
    dateOfBirth: '1995-02-01T17:25:00',
    email: '1623@gmail.com',
    firstName: 'Roma',
    id: 3,
    lastName: 'Petrvo',
    participantNumber: 1,
    roles: [{}],
    startDate: '2022-12-06T12:15:29',
    startPosition: 1,
  },
  participantId: 3,
  trackerList: [
    {
      currentLocation: { type: 'Point', coordinates: [0.0, 0.0] },
      gameTime: '2022-12-06T12:15:39',
      isDisconnected: false,
      participantId: 3,
    },
  ],
};

const currentActiveTracker = {
  coordinates: [0.0, 0.0],
  id: '3',
  options: { iconColor: '#c9fb7e' },
  properties: {
    hintContent: ' 1 - Roma Petrvo is active',
    iconContent: 1,
  },
};

const currentDisconnectedTracker = {
  coordinates: [0.0, 0.0],
  id: '3',
  options: { iconColor: variables.disconnectedParticipantColor },
  properties: {
    hintContent: ' 1 - Roma Petrvo is disconnected',
    iconContent: 'D',
  },
};

describe('test getParticipantMarkerPropsFromTracker function', () => {
  test('test getParticipantMarkerPropsFromTracker with connected participant', () => {
    expect(
      getParticipantMarkerPropsFromTracker(participantTracker),
    ).toStrictEqual(currentActiveTracker);
  });

  test('test getParticipantMarkerPropsFromTracker with disconnected participant', () => {
    const disconnectedParticipantTracker = { ...participantTracker };
    disconnectedParticipantTracker.trackerList[0].isDisconnected = true;
    expect(
      getParticipantMarkerPropsFromTracker(disconnectedParticipantTracker),
    ).toStrictEqual(currentDisconnectedTracker);
  });
});
