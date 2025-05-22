import { Organization } from './Organization';
import { RootUser } from './RootUser';
import { ISODate } from './ISODate';

export interface UserFeedback {
  comment: string;
  hasRead: boolean;
  id: number;
  organization: Organization;
  ranking: number;
  sendDate: ISODate;
  user: RootUser;
}
