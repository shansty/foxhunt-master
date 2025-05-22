import {
  STATUS_CANCELED,
  STATUS_FINISHED,
  STATUS_RUNNING,
  STATUS_SCHEDULED,
} from 'src/constants/competitionStatusConst';

export const DAY = 'Day';
export const MONTH = 'Month';
export const SCHEDULER = 'scheduler';
export const LIST = 'list';

export const RESOURCES = [
  {
    id: STATUS_RUNNING,
    color: '#1faa00',
  },
  {
    id: STATUS_FINISHED,
    color: '#9e9e9e',
  },
  {
    id: STATUS_SCHEDULED,
    color: '#0277bd',
  },
  {
    id: STATUS_CANCELED,
    color: '#c62828',
  },
];

export const initialState = {
  sort: { column: 'startDate', order: 'desc' },
  competitionsToday: [],
  pager: {
    page: 0,
    rowsPerPage: 25,
  },
};
