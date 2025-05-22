import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import { USER_INVITATION_LOCAL_DATE_FORMAT } from './commonConstants';

dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.extend(timezone);

const tz = dayjs.tz.guess();

export const formatDate = (strDate: dayjs.ConfigType) =>
  dayjs(strDate).format('DD/MM/YYYY HH:mm');

export const formatInvitationDate = (strDate: dayjs.ConfigType) =>
  dayjs.utc(strDate).tz(tz).format(USER_INVITATION_LOCAL_DATE_FORMAT);

export const formatArrayIntoUrlParams = (params: Object) => {
  const parts: string[] = [];

  const convertPart = (key: string, val: any) => {
    parts.push(key + '=' + val);
  };

  Object.entries(params).forEach(([key, val]) => {
    if (val === null || typeof val === 'undefined') return;

    if (Array.isArray(val)) val.forEach((v, i) => convertPart(`${key}`, v));
    else convertPart(key, val);
  });

  return parts.join('&');
};
