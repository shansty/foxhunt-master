import { Request } from 'express';
import { GoogleUser } from './googleUser.interface';

export interface GoogleRequest extends Request {
  user: GoogleUser;
}
