import { Injectable } from '@nestjs/common';
import { generateNonce, SiweMessage } from 'siwe';
import { CookieData } from './signature.types';
import { noSiweSessionError } from '../utils/errorHandler';

@Injectable()
export class SignatureService {
  checkSiweSession(req: any) {
    if (!req.session.siwe) {
      throw noSiweSessionError();
    }
  }

  getNonce(): string {
    return generateNonce();
  }

  async verifyAndGetCookieData(
    message: string,
    signature: string,
    nonce: string,
  ): Promise<CookieData> {
    const SIWEObject = new SiweMessage(message);
    const { data: siweMessage } = await SIWEObject.verify({
      signature: signature,
      nonce: nonce,
    });
    const expirationDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // one week from now
    return {
      expirationDate,
      siweMessage,
    };
  }

  getPersonalInformation(req: any): string {
    this.checkSiweSession(req);
    return req.session.siwe.address;
  }
}
