export const DATE_FORMAT = 'DD/MM/YYYY HH:mm:ss';
export const SCV_DATE_FORMAT = 'MMMM Do YYYY h:mm:ss a';
export const TIME_FORMAT = 'HH:mm:ss';
export const SHORT_DATE_FORMAT = 'MM/DD/YYYY';
export const SERVER_DATE_FORMAT = 'YYYY-MM-DDThh:mm:ssZ';
export const SHORT_SERVER_DATE_FORMAT = 'YYYY-MM-DDThh:mm:ss';
export const HALF_FREQUENCY_INTERVAL = 0.1;
export const SOUND_INTERVAL = 0.2;
export const SOUND_COEFFICIENT = 200;
export const MIN_VOLUME = 0;
export const MAX_VOLUME = 1;
export const VOLUME_LEVELS = 100;
export const INITIAL_VOLUME = 30;
export const INITIAL_FREQUENCY = 0;
export const INITIAL_FREQUENCY_CLOSENESS = 0.2;
export const INITIAL_DISTANCE_TO_CURRENT_FOX = -1;
export const ZERO_FOX_INDEX = 0;
export const INITIAL_AMOUNT_OF_FOUND_FOXES = 0;
export const ANGLE_DIVIDER = 18;
export const CHANGE_TRACK_COEFFICIENT = 0.02;
export const MAP_HEIGHT = 300;
export const DEFAULT_FREQUENCY = 3.5;
export const DEFAULT_SILENCE_INTERVAL = false;
export const DEFAULT_FOX_AMOUNT = 1;
export const DEFAULT_COMPETITION_DURATION = 30;
export const DEFAULT_FOX_DURATION = 60;
export const DEFAULT_AREA = 300;
export const DEFAULT_RADIUS = 150;
export const DEFAULT_USER_RADIUS_FOR_SINGLE_COMPETITIONS = 15;
export const DEFAULT_USER_RADIUS_FOR_COMMAND_COMPETITIONS = 10;
export const DEFAULT_EDGES_AMOUNT = 32;
export const SECONDS_IN_MINUTE = 60;
export const MILLISECONDS_IN_SECOND = 1000;
export const METERS_IN_KILOMETER = 1000;
export const PI_NUMBER = 3.14;
export const DEGREE_360 = 360;
export const DEGREE_180 = 180;
export const NUMBER_OF_CARDS_IN_RESULT_PAGE = '50';
export const UNITS = {
  SECONDS: 'sec',
  MINUTE: 'min',
  FREQUENCY: 'MGz',
  METERS: 'm',
};

export const FOX_AMOUNT_SELECTOR = [
  { label: 'One', value: 1 },
  { label: 'Two', value: 2 },
  { label: 'Three', value: 3 },
  { label: 'Four', value: 4 },
  { label: 'Five', value: 5 },
];

export const COMPETITION_AREA_SELECTOR = [
  { label: '100 m', value: 100 },
  { label: '110 m', value: 110 },
  { label: '120 m', value: 120 },
  { label: '130 m', value: 130 },
  { label: '140 m', value: 140 },
  { label: '150 m', value: 150 },
  { label: '160 m', value: 160 },
  { label: '170 m', value: 170 },
  { label: '180 m', value: 180 },
  { label: '190 m', value: 190 },
  { label: '200 m', value: 200 },
  { label: '210 m', value: 210 },
  { label: '220 m', value: 220 },
  { label: '230 m', value: 230 },
  { label: '240 m', value: 240 },
  { label: '250 m', value: 250 },
  { label: '260 m', value: 260 },
  { label: '270 m', value: 270 },
  { label: '280 m', value: 280 },
  { label: '290 m', value: 290 },
  { label: '300 m', value: 300 },
];

export const FREQUENCY_SELECTOR = [
  { label: '3.5 MGz', value: 3.5 },
  { label: '144.0 MGz', value: 144.0 },
];

export const DURATION_SELECTOR = [
  { label: '15 min', value: 15 },
  { label: '16 min', value: 16 },
  { label: '17 min', value: 17 },
  { label: '18 min', value: 18 },
  { label: '19 min', value: 19 },
  { label: '20 min', value: 20 },
  { label: '21 min', value: 21 },
  { label: '22 min', value: 22 },
  { label: '23 min', value: 23 },
  { label: '24 min', value: 24 },
  { label: '25 min', value: 25 },
  { label: '26 min', value: 26 },
  { label: '27 min', value: 27 },
  { label: '28 min', value: 28 },
  { label: '29 min', value: 29 },
  { label: '30 min', value: 30 },
];

export const FOX_DURATION_SELECTOR = [
  { label: '30 sec', value: 30 },
  { label: '40 sec', value: 40 },
  { label: '50 sec', value: 50 },
  { label: '60 sec', value: 60 },
  { label: '70 sec', value: 70 },
  { label: '80 sec', value: 80 },
  { label: '90 sec', value: 90 },
];

export const DEFAULT_SINGLE_COMPETITIONS = [
  {
    label: 'Easy',
    value: {
      area: 100,
      duration: 30,
      foxAmount: 1,
      foxDuration: 60,
      frequency: DEFAULT_FREQUENCY,
      hasSilenceInterval: false,
    },
  },
  {
    label: 'Normal',
    value: {
      area: DEFAULT_AREA,
      duration: 30,
      foxAmount: 3,
      foxDuration: 60,
      frequency: DEFAULT_FREQUENCY,
      hasSilenceInterval: false,
    },
  },
  {
    label: 'Hard',
    value: {
      area: 500,
      duration: 30,
      foxAmount: 3,
      foxDuration: 30,
      frequency: DEFAULT_FREQUENCY,
      hasSilenceInterval: true,
    },
  },
  {
    label: 'Advanced',
    value: {
      area: 1000,
      duration: 60,
      foxAmount: 5,
      foxDuration: 60,
      frequency: DEFAULT_FREQUENCY,
      hasSilenceInterval: true,
    },
  },
  {
    label: 'Custom',
    value: {
      custom: true,
    },
  },
];

export const DISTANCE_TO_TRIGGER_CALLBACK = 0.1; // meter
export const ZERO_FRACTION_DIGITS = 0;
export const ONE_FRACTION_DIGIT = 1;
export const TWO_FRACTION_DIGITS = 2;

export const INTERNAL_STORE_FOLDER_NAME = 'FoxHunt';
export const INTERNAL_STORE_FOLDER_NAME_FOR_RESULTS = 'Results';
export const ENCODING = 'utf8';

export const USER_LOCATION_TIMEOUT = 25000;
export const COMPASS_UPDATE_RATE = 5;

export const INITIAL_LOCATION_PERMISSION_STATE = 0;
export const ALLOWED_LOCATION_PERMISSION_STATE = 1;
export const FORBIDDEN_LOCATION_PERMISSION_STATE = 2;

export const LATITUDE_INDEX = 0;
export const LONGITUDE_INDEX = 1;

export const EMPTY_STRING = '';
export const INITIAL_STAR_COUNT = 0;

export const HELP_CONTENT_ABOUT_TITLE = 'About Foxhunt';
export const HELP_CONTENT_RULES_TITLE = 'Rules';
export const HELP_CONTENT_FAQ_TITLE = 'FAQ';

export const BOOK_ICON = 'book-outline';
export const ALERT_ICON = 'alert-circle-outline';
export const HELP_ICON = 'help-circle-outline';

export const MIN_NUMBER_WITHOUT_LEADING_ZERO = 10;
export const TIMES_TO_SUBMIT_FEEDBACK = 3;
export const HELP_LOG_SCREEN = 'T-TimeStamp\n'+
  'Cur.Loc(lt,ln)-CurrentLocation\n' +
  'DTF-DistanceToCurrentFox\n' +
  'FoxLoc(lt,ln)-CurrentFoxLoc.\n' +
  'FN-FoxNumber\n';

export const TABLE_COLUMN = 5;
export const TABLE_HEADER = [
  'T',
  `Cur.Loc.(lt/ln)`,
  'DTF (m)',
  `FoxLoc.(lt/ln)`,
  'FN',
  '\n',
];

export const SINGLE_COMPETITION_HEADER = 'Single Competition';
export const RADIO_ORIENTEERING_HEADER = 'Radio Orienteering Competition';

const HELP_CONTENT_STYLE =
  { color: '#E7E7E7', fontSize: 15, fontWeight: '100', textAlign: 'justify' };
const HELP_CONTENT_HEADER_STYLE =
  { color: '#E7E7E7', textAlign: 'justify' };
export const EDITOR_ELEMENT_STYLE = {
  'p': { ...HELP_CONTENT_STYLE },
  'h1': { ...HELP_CONTENT_HEADER_STYLE },
  'h2': { ...HELP_CONTENT_HEADER_STYLE },
  'h3': { ...HELP_CONTENT_HEADER_STYLE },
  'ul': { ...HELP_CONTENT_STYLE },
  'li': { ...HELP_CONTENT_STYLE },
  'ol': { ...HELP_CONTENT_STYLE },
};
