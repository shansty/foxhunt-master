import { PORT } from '@env';

export const convertToSseURL = (competitionId) => {
  return `${PORT}/api/v1/admin/active-competitions/${competitionId}/subscription`;
};
