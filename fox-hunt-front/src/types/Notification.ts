import { OptionsObject } from 'notistack';

export interface Notification {
  key?: string | number;
  message: string;
  options: OptionsObject;
  dismissed?: boolean;
}
