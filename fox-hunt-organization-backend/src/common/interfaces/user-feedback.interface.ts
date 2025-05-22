import { IUser } from './user.interface';

export interface IUserFeedback {
  userFeedbackId: number;
  comment?: string;
  ranking?: number;
  sendDate: string;
  hasRead: boolean;
  user?: IUser;
}
