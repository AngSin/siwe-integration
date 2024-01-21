import { Test, TestingModule } from '@nestjs/testing';
import { SignatureController } from './signature.controller';
import { SignatureService } from './signature.service';
import { SiweMessage } from 'siwe';
import * as errorUtils from '../utils/errorHandler';

jest.mock('siwe');

describe('UserController', () => {
  let controller: SignatureController;
  let signatureService: SignatureService;
  const mockedRepository = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SignatureController],
      providers: [
        SignatureService,
        {
          provide: 'UserRepository',
          useValue: mockedRepository,
        },
      ],
    }).compile();

    controller = module.get<SignatureController>(SignatureController);
    signatureService = module.get<SignatureService>(SignatureService);
  });

  describe('getNonce', () => {
    it('should retrieve nonce from the service layer and set it in the session', async () => {
      const mockedNonce = 'mockedNonce';
      jest
        .spyOn(signatureService, 'getNonce')
        .mockImplementation(() => mockedNonce);
      const mockReq = {
        session: { nonce: undefined },
      };
      const mockRes = {
        status: jest.fn(),
        send: jest.fn(),
      };
      await controller.getNonce(mockReq, mockRes);

      expect(mockReq.session.nonce).toEqual(mockedNonce);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith(mockedNonce);
    });
  });

  describe('verifySignature', () => {
    it('should set cookie data on successful signature verification', async () => {
      const message = 'mockedSiweMessage';
      const signature = 'mockSignature';
      const mockReq = {
        body: {
          message,
          signature,
        },
        session: {
          siwe: undefined,
          cookie: {
            expires: undefined,
          },
          save: jest.fn(),
        },
      };
      const mockRes = {
        status: jest.fn(),
        send: jest.fn(),
      };
      const expirationDate = new Date();
      const siweMessage = new SiweMessage(message);

      jest
        .spyOn(signatureService, 'verifyAndGetCookieData')
        .mockImplementation(() =>
          Promise.resolve({
            siweMessage,
            expirationDate,
          }),
        );

      await controller.verifySignature(mockReq, mockRes);
      expect(mockReq.session.siwe).toEqual(siweMessage);
      expect(mockReq.session.cookie.expires).toEqual(expirationDate);
      expect(mockReq.session.save).toHaveBeenCalled();
    });

    it('should send status code 422 if no message is sent in the request', async () => {
      const mockRes = {
        status: jest.fn(),
        json: jest.fn(),
      };
      const mockReq = {
        body: {
          message: undefined,
        },
      };

      await controller.verifySignature(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(422);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Expected prepareMessage object as body.',
      });
    });

    it('should call `handleSiweErrorTypes` if an error is thrown', async () => {
      const mockReq = {
        body: {
          message: 'mockMessage',
          signature: 'mockSignature',
        },
        session: {
          siwe: {},
          cookie: {
            expires: new Date(),
          },
          save: () => {},
        },
      };
      const mockRes = {};
      const err = new Error();
      jest
        .spyOn(signatureService, 'verifyAndGetCookieData')
        .mockImplementation(() => {
          throw err;
        });
      jest
        .spyOn(errorUtils, 'handleSiweErrorTypes')
        .mockImplementation(() => {});
      await controller.verifySignature(mockReq, mockRes);
      expect(errorUtils.handleSiweErrorTypes).toHaveBeenCalledWith(
        err,
        mockReq,
        mockRes,
      );
    });
  });

  describe('getPersonalInformation', () => {
    it('should send the address from the SIWE session', async () => {
      const mockReq = {};
      const mockRes = {
        setHeader: jest.fn(),
        send: jest.fn(),
      };
      const address = '0x1234';
      jest
        .spyOn(signatureService, 'getPersonalInformation')
        .mockImplementation(() => address);

      await controller.getPersonalInformation(mockReq, mockRes);
      expect(mockRes.setHeader).toHaveBeenCalledWith(
        'Content-Type',
        'text/plain',
      );
      expect(mockRes.send).toHaveBeenCalledWith(address);
    });

    it('should call `handleNoSiweSessionError` in case of no SIWE session', async () => {
      const mockReq = {};
      const mockRes = {
        setHeader: jest.fn(),
        send: jest.fn(),
      };
      const err = new Error();
      jest
        .spyOn(signatureService, 'getPersonalInformation')
        .mockImplementation(() => {
          throw err;
        });
      jest
        .spyOn(errorUtils, 'handleNoSiweSessionError')
        .mockImplementation(() => {});
      await controller.getPersonalInformation(mockReq, mockRes);

      await expect(errorUtils.handleNoSiweSessionError).toBeCalledWith(
        err,
        mockRes,
      );
    });
  });

  describe('logOut', () => {
    it('should log out user', async () => {
      const mockReq = {
        session: {
          siwe: 'someSiweSession',
        },
      };
      const mockRes = {
        sendStatus: jest.fn(),
      };
      await controller.logOut(mockReq, mockRes);

      expect(mockReq.session.siwe).toEqual(null);
      expect(mockRes.sendStatus).toHaveBeenCalledWith(200);
    });
  });
});
