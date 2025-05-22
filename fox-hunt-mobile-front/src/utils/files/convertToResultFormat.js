import moment from 'moment';
import { DATE_FORMAT, TIME_FORMAT } from '../constants/commonConstants';

export const convertToResultFormat = (state) => {
  const { competition: { foxAmount }, gameState: { foundFoxes },
    checkList, startOfParticipation } = state;
  const competitionTime = moment.utc(moment(checkList.completionTime, DATE_FORMAT)
    .diff(moment(startOfParticipation, DATE_FORMAT)))
    .format(TIME_FORMAT);

  return { foxAmount, foundFoxes, competitionTime };
};
