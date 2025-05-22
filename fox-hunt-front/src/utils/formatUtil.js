import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import _ from 'lodash';
import { ROLES_BY_RIGHTS_LEVEL } from '../constants/roles';
import { DATE_FORMATS } from '../constants/dateFormatConstants';

dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.extend(timezone);

const tz = dayjs.tz.guess();

export const formatDate = (strDate, isScheduleView = false) =>
  isScheduleView
    ? dayjs.utc(strDate).format(DATE_FORMATS.DATE_TIME_COMMON_DISPLAY)
    : dayjs.utc(strDate).tz(tz).format(DATE_FORMATS.DATE_TIME_COMMON_DISPLAY);

export const convertTimeZone = (strDate) =>
  dayjs.utc(strDate).tz(tz).format(DATE_FORMATS.DATE_PICKER_DISPLAY_WITH_TIME);

export const convertTimeZonePlusMinute = (strDate) =>
  dayjs
    .utc(strDate)
    .tz(tz)
    .add(1, 'minute')
    .format(DATE_FORMATS.DATE_PICKER_DISPLAY_WITH_TIME);

export const formatTimeOnly = (strDate) =>
  dayjs.utc(strDate).tz(tz).format(DATE_FORMATS.TIME_COMMON_DISPLAY);

export const formatToLocalDate = (strDate) =>
  dayjs.utc(strDate).tz(tz).format(DATE_FORMATS.DATE_LOCAL_DISPLAY);

export const formatDateOnly = (strDate) =>
  dayjs.utc(strDate).tz(tz).format(DATE_FORMATS.DATE_COMMON_DISPLAY);

export const formatDateNoTimeZone = (strDate) =>
  dayjs.utc(strDate).tz(tz).format(DATE_FORMATS.DB_NO_TIME_ZONE);

export const formatDateAndTime = (strDate) =>
  `${dayjs.utc(strDate).tz(tz).format('DD/MM/YYYY')} at ${dayjs
    .utc(strDate)
    .tz(tz)
    .format('HH:mm')}`;

export const enumStringToReadableFormat = (str) =>
  _.startCase(_.camelCase(str));

export const sortUsersRolesByRights = (users) => {
  if (users !== '') {
    if (!(users instanceof Array)) {
      users = [users];
    }
    return users.filter((user) => {
      return (
        user.roles &&
        [...user.roles].sort(
          (roleA, roleB) =>
            ROLES_BY_RIGHTS_LEVEL.indexOf(roleA.role) -
            ROLES_BY_RIGHTS_LEVEL.indexOf(roleB.role),
        )
      );
    });
  }
};
