export const ENTITY = 'competitions';

export const GET_COMPETITIONS = `${ENTITY}/getCompetitions`;
export const GET_CURRENT_COMPETITIONS = `${ENTITY}/getCurrentCompetitions`;
export const GET_COMPETITION_BY_DATE = `${ENTITY}/getCompetitionByDate`;
export const GET_COMPETITION_BY_ID = `${ENTITY}/getCompetitionById`;
export const GET_INVITATIONS_BY_COMPETITION_ID = `${ENTITY}/getAllInvitationsByCompetitionId`;

export const ACCEPT_INVITATION_TO_COMPETITION_BY_USER_ID = `${ENTITY}/acceptInvitationToCompetitionByUserId`;
export const INVITE_TO_COMPETITION_BY_USER_ID = `${ENTITY}/inviteToCompetitionByUserId`;

export const EXCLUDE_FROM_COMPETITION_BY_USER_ID = `${ENTITY}/excludeFromCompetitionByUserId`;
export const DECLINE_INVITATION_TO_COMPETITION_BY_USER_ID = `${ENTITY}/declineInvitationToCompetitionByUserId`;
export const DECLINE_INVITATION_PERMANENTLY = `${ENTITY}/declineInvitationPermanently`;

export const REMOVE_COMPETITION = `${ENTITY}/removeCompetition`;
export const CREATE_COMPETITION = `${ENTITY}/createCompetition`;
export const UPDATE_COMPETITION = `${ENTITY}/updateCompetition`;
export const START_COMPETITION = `${ENTITY}/startCompetition`;
export const FINISH_COMPETITION = `${ENTITY}/finishCompetition`;
export const CANCEL_COMPETITION = `${ENTITY}/cancelCompetition`;

export const GET_GAME_SATE = `${ENTITY}/getGameState`;
export const CREATE_COMPETITION_FROM_TEMPLATE = `${ENTITY}/createCompetitionFromTemplate`;
