import { Injectable, HttpStatus } from '@nestjs/common';
import { generateNonce, SiweErrorType, SiweMessage } from 'siwe';
import { Response } from 'express';

@Injectable()
export class SignatureService {
  getNonce(req: any, res: Response) {
    req.session.nonce = generateNonce();
    res.status(HttpStatus.OK);
    return res.send(req.session.nonce);
  }

  async verify(req: any, res: Response) {
    try {
      if (!req.body.message) {
        res
          .status(HttpStatus.UNPROCESSABLE_ENTITY)
          .json({ message: 'Expected prepareMessage object as body.' });
        return;
      }

      const SIWEObject = new SiweMessage(req.body.message);
      const { data: message } = await SIWEObject.verify({
        signature: req.body.signature,
        nonce: req.session.nonce,
      });

      req.session.siwe = message;
      const oneWeekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      req.session.cookie.expires = oneWeekFromNow;
      req.session.save(() => res.status(HttpStatus.OK).send(true));
    } catch (e) {
      req.session.siwe = null;
      req.session.nonce = null;
      console.error(e);
      switch (e) {
        case SiweErrorType.EXPIRED_MESSAGE: {
          req.session.save(() =>
            res.status(HttpStatus.UNAUTHORIZED).json({ message: e.message }),
          );
          break;
        }
        case SiweErrorType.INVALID_SIGNATURE: {
          req.session.save(() =>
            res
              .status(HttpStatus.UNPROCESSABLE_ENTITY)
              .json({ message: e.message }),
          );
          break;
        }
        default: {
          req.session.save(() =>
            res
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .json({ message: e.message }),
          );
          break;
        }
      }
    }
  }

  async getPersonalInformation(req: any, res: Response) {
    if (!req.session.siwe) {
      return res.sendStatus(HttpStatus.FORBIDDEN);
    }
    res.setHeader('Content-Type', 'text/plain');
    res.send(req.session.siwe.address);
  }

  async logOut(req: any, res: Response) {
    req.session.siwe = null;
    res.sendStatus(HttpStatus.OK);
  }
}
