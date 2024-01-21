import { Request, Response } from 'express';
import { HttpStatus } from '@nestjs/common';
import { SiweErrorType } from 'siwe';

export const noSiweSessionMessage = 'No SIWE session found';

export interface NoSiweSessionError extends Error {
  message: 'No SIWE session found';
}

export const noSiweSessionError = () => new Error(noSiweSessionMessage);
export const isNoSiweSessionError = (
  error: Error,
): error is NoSiweSessionError => error.message === noSiweSessionMessage;

export const handleNoSiweSessionError = (e: Error, res: Response) => {
  if (isNoSiweSessionError(e)) {
    res.sendStatus(HttpStatus.FORBIDDEN);
  } else {
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
  }
};

export const handleSiweErrorTypes = (e: any, req: any, res: Response) => {
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
};
