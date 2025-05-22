import {
  ACTION_TYPE_DELIMITER,
  STATE,
} from '../store/constants/commonConstants';
import _ from 'lodash';

export function createRequestSuccessFailure(action: string, entity: string) {
  return {
    request: [action, entity, STATE.REQUEST].join(ACTION_TYPE_DELIMITER),
    success: [action, entity, STATE.SUCCESS].join(ACTION_TYPE_DELIMITER),
    failure: [action, entity, STATE.FAILURE].join(ACTION_TYPE_DELIMITER),
  };
}

export function constructKeyKeyObject(object: object) {
  return Object.fromEntries(Object.keys(object).map((key) => [key, key]));
}

export function emptyStringsToNull<T>(obj: T): {
  [key in keyof T]: T[key] extends string ? T[key] | null : T[key];
} {
  return Object.fromEntries(
    Object.entries(obj as any).map(([key, value]: any) => {
      let newValue: T[typeof key] | null = value;
      if (value === '') {
        newValue = null;
      }
      return [key, newValue];
    }),
  );
}

export const enumStringToReadableFormat = _.flow([
  _.startCase,
  _.toLower,
  _.upperFirst,
]);
