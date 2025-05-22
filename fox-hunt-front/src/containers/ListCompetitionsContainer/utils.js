import {
  buildCompetitionInvitationsByIdUrl,
  buildLaunchCompetitionByIdUrl,
  buildReplayCompetitionById,
  buildWatchOneCompetitionByIdUrl,
} from '../../api/utils/navigationUtil';
import {
  STATUS_CANCELED,
  STATUS_FINISHED,
  STATUS_RUNNING,
} from '../../constants/competitionStatusConst';

export const goToCompetitionDetails = (competition) => {
  if (competition.status === STATUS_RUNNING) {
    return buildWatchOneCompetitionByIdUrl(competition.id);
  } else if (competition.status === STATUS_FINISHED) {
    return buildReplayCompetitionById(competition.id);
  } else if (competition.status === STATUS_CANCELED) {
    return buildCompetitionInvitationsByIdUrl(competition.id);
  } else {
    return buildLaunchCompetitionByIdUrl(competition.id);
  }
};

export const getAllCompetitionDropDownMenuItems = (
  competition,
  removeCompetition,
  fetchCompetitionAndRedirect,
) => [
  {
    id: competition.id,
    title: 'Details',
    action: () => fetchCompetitionAndRedirect(competition),
  },
  {
    id: competition.id,
    title: 'Remove',
    to: '#',
    onClick: () => removeCompetition(competition),
  },
];
