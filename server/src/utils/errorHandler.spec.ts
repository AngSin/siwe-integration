import {
  handleNoSiweSessionError,
  handleSiweErrorTypes,
  noSiweSessionError,
} from './errorHandler';
import { Response } from 'express';

describe('errorHandler', () => {
  describe('handleNoSiweSessionError', () => {
    it('should send a 403 if SIWE session is absent', () => {
      const err = noSiweSessionError();
      const mockRes = {
        sendStatus: jest.fn(),
      };
      handleNoSiweSessionError(err, mockRes as unknown as Response);
      expect(mockRes.sendStatus).toHaveBeenCalledWith(403);
    });

    it('should send a 500 if SIWE session is present', () => {
      const err = new Error();
      const mockRes = {
        sendStatus: jest.fn(),
      };
      handleNoSiweSessionError(err, mockRes as unknown as Response);
      expect(mockRes.sendStatus).toHaveBeenCalledWith(500);
    });
  });

  describe('handleSiweErrorTypes', () => {
    it('should handle Siwe Error Types', async () => {
      const mockReq = {
        session: {
          siwe: 'siwe',
          nonce: 'nonce',
          save: jest.fn(),
        },
      };
      const mockRes = {
        status: jest.fn(),
      };
      const err = new Error();
      handleSiweErrorTypes(err, mockReq, mockRes as unknown as Response);

      expect(mockReq.session.siwe).toEqual(null);
      expect(mockReq.session.nonce).toEqual(null);
      expect(mockReq.session.save).toHaveBeenCalled();
    });
  });
});
