import { get } from 'lodash';

// TODO: replace console with the logger, when it's in place
export const parseEventMessage = (event) => {
  try {
    return JSON.parse(event.data);
  } catch (error) {
    console.error(`Failed to parse event message: ${event.data}`, error);
  }
  return null;
};

export const getCompetitionResultFromSseResultMessage = (
  competitionId,
  data,
) => {
  if (!competitionId) {
    return [];
  }

  if (get(data, 'competitionId') !== competitionId) {
    return [];
  }

  return get(data, 'userResultList', []);
};
