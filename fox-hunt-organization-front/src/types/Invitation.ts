import { User } from './RootUser';
import { Organization } from './Organization';
import { ISODate } from './ISODate';

export interface Invitation {
  name?: string;
  endDate: ISODate;
  organizationEntity: Organization;
  startDate: ISODate;
  status: 'NEW' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED';
  token: string;
  userEntity: User;
  userInvitationId: number | null;
}
