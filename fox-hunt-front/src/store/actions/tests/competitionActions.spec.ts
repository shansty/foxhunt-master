import {
  declineInvitationToCompetitionByUserId,
  inviteToCompetitionByUserId,
} from '../competitionActions';
import {
  DECLINE_INVITATION_TO_COMPETITION_BY_USER_ID,
  INVITE_TO_COMPETITION_BY_USER_ID,
} from '../types/competitionsTypes';

const declineInvitation = {
  competitionId: 14,
  createdAt: '2022-12-22T11:49:49',
  id: 63,
  participant: { id: 20 },
  source: 'Trainer',
  status: 'DECLINED',
  updatedAt: '2022-12-22T11:49:49',
};

const newInvitation = {
  competitionId: 14,
  createdAt: '2022-12-01T11:49:00',
  id: 100,
  participant: { id: 15 },
  source: 'Trainer',
  status: 'PENDING',
  updatedAt: '2022-12-01T11:49:00',
};

const invitations = [
  {
    competitionId: 14,
    createdAt: '2022-12-22T11:49:49',
    id: 63,
    participant: { id: 20 },
    source: 'Trainer',
    status: 'PENDING',
    updatedAt: '2022-12-22T11:49:49',
  },
];

const competitionId = 14;
const participantId = 20;

jest.mock('axios', () => {
  return {
    create: () => {
      return {
        interceptors: {
          request: { eject: jest.fn(), use: jest.fn() },
          response: { eject: jest.fn(), use: jest.fn() },
        },
        put: () => ({ data: declineInvitation }),
        post: () => ({ data: newInvitation }),
      };
    },
  };
});

describe('declineInvitationToCompetitionByUserIdThunk', () => {
  it('should make request with resolved response', async () => {
    const dispatch = jest.fn();
    const thunk = declineInvitationToCompetitionByUserId({
      invitations,
      competitionId,
      participantId,
    });

    await thunk(
      dispatch,
      () => {},
      () => {},
    );
    const { calls } = dispatch.mock;
    const [start, end] = calls;

    expect(start[0].type).toBe(
      `${DECLINE_INVITATION_TO_COMPETITION_BY_USER_ID}/pending`,
    );
    expect(end[0].type).toBe(
      `${DECLINE_INVITATION_TO_COMPETITION_BY_USER_ID}/fulfilled`,
    );
    expect(end[0].payload).toEqual([declineInvitation]);
  });
});

describe('inviteToCompetitionByUserIdThunk', () => {
  it('should make request with resolved response', async () => {
    const dispatch = jest.fn();
    const thunk = inviteToCompetitionByUserId({
      invitations,
      competitionId,
      participantId,
    });

    await thunk(
      dispatch,
      () => {},
      () => {},
    );
    const { calls } = dispatch.mock;
    const [start, end] = calls;

    expect(start[0].type).toBe(`${INVITE_TO_COMPETITION_BY_USER_ID}/pending`);
    expect(end[0].type).toBe(`${INVITE_TO_COMPETITION_BY_USER_ID}/fulfilled`);
    expect(end[0].payload).toEqual([newInvitation]);
  });
});
