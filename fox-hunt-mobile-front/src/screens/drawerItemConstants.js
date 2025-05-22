import {
  COMMAND_COMPETITIONS, FEEDBACK_PAGE, HELP_PAGE,
  HOME_PAGE,
  MY_RESULTS,
  SETTINGS_PAGE,
  SINGLE_COMPETITION_START,
  SINGLE_PARTICIPANT_RADIO_ORIENTEERING_START,
  UPCOMING_COMPETITIONS,
} from '../utils/constants/routeNames';

export const topMenuItems = [
  {
    icon: 'home',
    label: 'Home',
    route: HOME_PAGE,
  },
  {
    icon: 'list-outline',
    label: 'Upcoming Competitions',
    route: UPCOMING_COMPETITIONS,
  },
  {
    icon: 'paw-outline',
    label: 'Live Competitions',
    route: COMMAND_COMPETITIONS,
  },
  {
    icon: 'radio',
    label: 'Radio Orienteering',
    route: SINGLE_PARTICIPANT_RADIO_ORIENTEERING_START,
  },
  {
    icon: 'game-controller-outline',
    label: 'Try NOW!',
    route: SINGLE_COMPETITION_START,
  },
  {
    icon: 'albums-outline',
    label: 'My results',
    route: MY_RESULTS,
  },
];

export const lowerMenuItems = [
  {
    icon: 'build-outline',
    label: 'Settings',
    route: SETTINGS_PAGE,
  },
  {
    icon: 'help-circle-outline',
    label: 'Help',
    route: HELP_PAGE,
  },
  {
    icon: 'mail-outline',
    label: 'App Feedback',
    route: FEEDBACK_PAGE,
  },

];
