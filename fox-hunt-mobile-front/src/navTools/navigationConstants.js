import {
  CHANGE_PASSWORD_PAGE,
  COMMAND_COMPETITION_PROCESS,
  COMMAND_COMPETITION_RESULT_SCREEN,
  COMMAND_COMPETITIONS,
  COMPETITIONS_DESCRIPTION,
  FEEDBACK_PAGE,
  GENERAL_PARTICIPANT_START_SETTINGS_SCREEN,
  HELP_DESCRIPTION_BLOCKS,
  HELP_PAGE,
  HOME_PAGE,
  MY_RESULTS,
  SETTINGS_PAGE, SINGLE_COMPETITION_PROCESS,
  SINGLE_COMPETITION_START,
  SINGLE_PARTICIPANT_RADIO_ORIENTEERING_START,
  SINGLE_PARTICIPANT_RESULT_SCREEN,
  UPCOMING_COMPETITIONS,
} from '../utils/constants/routeNames';
import HomePage from '../screens/HomePage';
import UpcomingCompetitionListScreen
  from '../screens/competition/upcoming/UpcomingCompetitionListScreen';
import UpcomingCompetitionDescriptionScreen
  from '../screens/competition/upcoming/UpcomingCompetitionDescriptionScreen';
import CommandCompetitionListScreen
  from '../screens/competition/command/CommandCompetitionListScreen';
import CommandCompetitionProcessScreen
  from '../screens/competition/command/CommandCompetitionProcessScreen';
import SingleParticipantRadioOrienteeringStartScreen
  from '../screens/competition/single/radioOrienteering/SingleParticipantRadioOrienteeringStartScreen';
import SingleParticipantFoxhuntStartScreen
  from '../screens/competition/single/foxhunt/SingleParticipantFoxhuntStartScreen';
import GeneralCompetitionResultScreen
  from '../screens/competition/single/GeneralCompetitionResultScreen';
import CommandCompetitionResultScreen
  from '../screens/competition/command/CommandCompetitionResultScreen';
import MyResultsPage from '../screens/results/MyResultsPage';
import SettingsPage from '../screens/settings/SettingsPage';
import ChangePasswordPage from '../screens/settings/ChangePasswordPage';
import HelpPage from '../screens/help/HelpPage';
import HelpDescriptionBlocks from '../screens/help/HelpDescriptionBlocks';
import AppFeedbackPage from '../screens/feedback/AppFeedbackPage';
import GeneralCompetitionStartSettingsScreen
  from '../screens/competition/single/GeneralCompetitionStartSettingsScreen';
import GeneralCompetitionProcessScreen
  from '../screens/competition/single/GeneralCompetitonProcessScreen';

export const screens = [
  {
    name: HOME_PAGE,
    component: HomePage,
  },
  {
    name: UPCOMING_COMPETITIONS,
    component: UpcomingCompetitionListScreen,
    options: { unmountOnBlur: true },
  },
  {
    name: COMPETITIONS_DESCRIPTION,
    component: UpcomingCompetitionDescriptionScreen,
    options: { unmountOnBlur: true },
  },
  {
    name: COMMAND_COMPETITIONS,
    component: CommandCompetitionListScreen,
    options: { unmountOnBlur: true },
  },
  {
    name: COMMAND_COMPETITION_PROCESS,
    component: CommandCompetitionProcessScreen,
    options: { swipeEnabled: false, gestureEnabled: false, unmountOnBlur: true },
  },
  {
    name: SINGLE_PARTICIPANT_RADIO_ORIENTEERING_START,
    component: SingleParticipantRadioOrienteeringStartScreen,
    options: { unmountOnBlur: true },
  },
  {
    name: SINGLE_COMPETITION_START,
    component: SingleParticipantFoxhuntStartScreen,
    options: { unmountOnBlur: true },
  },
  {
    name: SINGLE_PARTICIPANT_RESULT_SCREEN,
    component: GeneralCompetitionResultScreen,
    options: { unmountOnBlur: true },
  },
  {
    name: COMMAND_COMPETITION_RESULT_SCREEN,
    component: CommandCompetitionResultScreen,
    options: { unmountOnBlur: true },
  },
  {
    name: MY_RESULTS,
    component: MyResultsPage,
    options: { unmountOnBlur: true },
  },
  {
    name: SETTINGS_PAGE,
    component: SettingsPage,
    options: { unmountOnBlur: true },
  },
  {
    name: CHANGE_PASSWORD_PAGE,
    component: ChangePasswordPage,
    options: { unmountOnBlur: true },
  },
  {
    name: HELP_PAGE,
    component: HelpPage,
  },
  {
    name: HELP_DESCRIPTION_BLOCKS,
    component: HelpDescriptionBlocks,
    options: { unmountOnBlur: true },
  },
  {
    name: FEEDBACK_PAGE,
    component: AppFeedbackPage,
    options: { unmountOnBlur: true },
  },
  {
    name: GENERAL_PARTICIPANT_START_SETTINGS_SCREEN,
    component: GeneralCompetitionStartSettingsScreen,
    options: { unmountOnBlur: true },
  },
  {
    name: SINGLE_COMPETITION_PROCESS,
    component: GeneralCompetitionProcessScreen,
    options: { unmountOnBlur: true },
  },
];
