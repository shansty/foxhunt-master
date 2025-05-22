import moment from 'moment';
import {
  ALERT_ICON,
  BOOK_ICON,
  HELP_CONTENT_ABOUT_TITLE,
  HELP_CONTENT_FAQ_TITLE,
  HELP_CONTENT_RULES_TITLE,
  HELP_ICON,
  MIN_NUMBER_WITHOUT_LEADING_ZERO,
  SHORT_DATE_FORMAT,
  TIME_FORMAT,
  UNITS,
  FREQUENCY_SELECTOR,
} from './constants/commonConstants';
import { Text as TextSlate } from 'slate';
import { decode } from 'html-entities';

export const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

export const isEmptyObject = (obj) => Object.keys(obj).length === 0 && obj.constructor === Object;

export const calculateRemainingTime = (start, duration) =>
  moment(start).add(duration, 'seconds').diff(moment(), 'seconds');

export const renderIcon = (title) => {
  switch (title) {
    case HELP_CONTENT_ABOUT_TITLE:
      return BOOK_ICON;
    case HELP_CONTENT_RULES_TITLE:
      return ALERT_ICON;
    case HELP_CONTENT_FAQ_TITLE:
      return HELP_ICON;
    default:
      return HELP_ICON;
  }
};

export const convertArrayToMap = (array) => array
  .reduce((acc, obj) => ( { ...acc, [obj.code]: obj.message }), {});

export const isNullNeeded = (time) => {
  return time >= MIN_NUMBER_WITHOUT_LEADING_ZERO ? time : `0${time}`;
};

export const serialize = (node) => {
  if (TextSlate.isText(node)) {
    let string = decode(node.text);
    if (node.bold) {
      string = `<strong>${string}</strong>`;
    }
    if (node.italic) {
      string = `<em>${string}</em>`;
    }
    if (node.underline) {
      string = `<u>${string}</u>`;
    }
    return string;
  }

  const children = node.children.map((n) => serialize(n)).join('</br>');

  switch (node.type) {
    case 'heading-one':
      return `<h1>${children}</h1>`;
    case 'heading-two':
      return `<h2>${children}</h2>`;
    case 'heading-three':
      return `<h3>${children}</h3>`;
    case 'bulleted-list':
      return `<ul>${children}</ul>`;
    case 'paragraph':
      return `<p>${children}</p>`;
    case 'list-item':
      return `<li>${children}</li>`;
    case 'numbered-list':
      return `<ol>${children}</ol>`;
    case 'image':
      return `<img  src={node.url} alt='text_img'/>`;
    case 'block-quote':
      return `<p>"${children}"</p>`;
    case node.children.bold:
      return `<strong>${children}</strong>`;
    default:
      return children;
  }
};

export const wrapInEditorObject = (contents) => {
  let editorContents = contents;
  if (typeof contents === 'string') {
    editorContents = JSON.parse(contents);
  }
  return { children: editorContents.editorText };
};

export const getSettingsList = (competition) => {
  return [
    {
      key: 'duration',
      type: 'slider',
      title: 'Duration of the competition',
      valueLabel: `${competition.duration} ${UNITS.MINUTE}`,
      textCode: 'SPC_SETTINGS_COMPETITION_DURATION',
      settings: {
        min: 5,
        max: 180,
        step: 5,
      },
    },
    {
      key: 'foxAmount',
      type: 'slider',
      title: 'Amount of foxes',
      valueLabel: competition.foxAmount,
      textCode: 'SPC_SETTINGS_POINTS_AMOUNT',
      settings: {
        min: 1,
        max: 5,
        step: 1,
      },
    },
    {
      key: 'area',
      type: 'slider',
      title: 'Search area distance',
      valueLabel: `${competition.area} ${UNITS.METERS}`,
      textCode: 'SPC_SETTINGS_COMPETITION_AREA',
      settings: {
        min: 50,
        max: 5000,
        step: 50,
      },
    },
    {
      key: 'frequency',
      type: 'radio',
      title: 'Frequency of the transmitter',
      valueLabel: `${competition.frequency} ${UNITS.FREQUENCY}`,
      textCode: 'SPC_SETTINGS_COMPETITION_FREQUENCY',
      data: FREQUENCY_SELECTOR,
    },
    {
      key: 'foxDuration',
      type: 'slider',
      title: 'Fox sound duration',
      valueLabel: `${competition.foxDuration} ${UNITS.SECONDS}`,
      textCode: 'SPC_SETTINGS_COMPETITION_FREQUENCY',
      settings: {
        min: 30,
        max: 90,
        step: 10,
      },
    },
    {
      key: 'silenceInterval',
      type: 'checkbox',
      title: 'Will there be a period of silence?',
      valueLabel: competition.hasSilenceInterval ? 'Yes' : 'No',
      textCode: 'SPC_SETTINGS_SILENCE_PERIOD',
    },
  ];
};

export const convertToDateFormat = (date) => {
  const { year, monthValue, dayOfMonth } = date;
  return moment(new Date(year, monthValue, dayOfMonth)).format(SHORT_DATE_FORMAT);
};

export const convertToTimeFormat = (date) => {
  const { year, monthValue, dayOfMonth, hour, minute, second } = date;
  return moment(new Date(year, monthValue, dayOfMonth, hour, minute, second))
    .format(TIME_FORMAT);
};

export const difToDateFormat = ( startTime, finishTime) => {
  return moment.utc(moment(finishTime, TIME_FORMAT)
    .diff(moment(startTime, TIME_FORMAT)))
    .format(TIME_FORMAT);
};

export const getCurrentDate = (dateFormat) => {
  return moment().format(dateFormat);
};
