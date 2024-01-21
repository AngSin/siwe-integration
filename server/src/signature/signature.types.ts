import { SiweMessage } from 'siwe';

export type CookieData = {
  expirationDate: Date;
  siweMessage: SiweMessage;
};
