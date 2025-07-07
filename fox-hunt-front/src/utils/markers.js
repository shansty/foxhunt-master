import { get } from 'lodash';

import variables from '../styles/_variables.module.scss';

export const getStartMarkerProps = ({
  coordinates,
  draggable = false,
  onDragEnd,
}) => ({
  id: 'startPoint',
  coordinates,
  properties: { iconContent: 'S' },
  options: { draggable, iconColor: variables.startMarkerColor },
  onDragEnd,
});

export const getFinishMarkerProps = ({
  coordinates,
  draggable = false,
  onDragEnd,
}) => ({
  id: 'finishPoint',
  coordinates,
  properties: { iconContent: 'F' },
  options: { draggable, iconColor: variables.finishMarkerColor },
  onDragEnd,
});

export const getFoxMarkerProps = ({
  coordinates,
  draggable = false,
  id,
  label,
  onDragEnd,
  isActive = false,
  frequency,
}) => ({
  id: `T${id}`,
  coordinates,
  properties: {
    iconContent: label ? label : `TS${id}`,
    iconCaption: isActive ? 'Active' : undefined,
    hintContent: `frequency - ${frequency}MGz`,
  },
  options: {
    draggable,
    iconColor: isActive
      ? variables.activeFoxMarkerColor
      : variables.foxMarkerColor,
  },
  onDragEnd,
});

export const getCenterMarkerProps = ({
  coordinates,
  draggable = true,
  onDragEnd,
}) => ({
  id: 'centerPoint',
  coordinates,
  options: { draggable, iconColor: variables.centerMarkerColor },
  onDragEnd,
});

export const getParticipantMarkerProps = ({
  coordinates,
  id,
  label,
  popupContent,
}) => ({
  id: `participantPoint${id}`,
  coordinates,
  properties: {
    iconContent: label,
    hintContent: popupContent,
  },
  options: { preset: 'islands#brownIcon' },
});

export const getParticipantMarkerPropsFromTracker = (
  participantTracker = { trackerList: [] },
) => {
  const { trackerList } = participantTracker;
  const activeTracker = trackerList[0];

  let color = get(participantTracker, ['participant', 'color'], 'brown');

  if (color == null) {
    color = 'brown';
  }

  return {
    id: get(activeTracker, 'participantId', '').toString(),
    coordinates: get(activeTracker, ['currentLocation', 'coordinates'], []),
    properties: {
      hintContent: activeTracker?.isDisconnected
        ? ` ${get(participantTracker, [
            'participant',
            'participantNumber',
          ])} - ${get(
            participantTracker,
            ['participant', 'firstName'],
            '',
          )} ${get(
            participantTracker,
            ['participant', 'lastName'],
            '',
          )} is disconnected`
        : ` ${get(participantTracker, [
            'participant',
            'participantNumber',
          ])} - ${get(
            participantTracker,
            ['participant', 'firstName'],
            '',
          )} ${get(
            participantTracker,
            ['participant', 'lastName'],
            '',
          )} is active`,
      iconContent: activeTracker?.isDisconnected
        ? 'D'
        : get(participantTracker, ['participant', 'participantNumber']),
    },
    options: activeTracker?.isDisconnected
      ? { iconColor: variables.disconnectedParticipantColor }
      : { iconColor: color },
  };
};

export const getAllParticipantMarkerProps = (activeTrackers = []) =>
  activeTrackers.map((tracker) =>
    getParticipantMarkerPropsFromTracker(tracker),
  );
