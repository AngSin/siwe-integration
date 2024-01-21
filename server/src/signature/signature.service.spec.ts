import { Test, TestingModule } from '@nestjs/testing';
import { SignatureService } from './signature.service';
import { noSiweSessionMessage } from '../utils/errorHandler';
import { SiweMessage } from 'siwe';

jest.mock('siwe');

describe('SignatureService', () => {
  let signatureService: SignatureService;
  const mockedRepository = {
    find: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockResolvedValue(null),
    save: jest.fn().mockResolvedValue(null),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [SignatureService],
    }).compile();

    mockedRepository.find.mockClear();
    signatureService = module.get<SignatureService>(SignatureService);
  });

  describe('checkSiweSession', () => {
    it('should not throw noSiweSessionError if req is correct', async () => {
      const mockReq = {
        session: {
          siwe: {
            address: '0x1234',
          },
        },
      };

      expect(() => signatureService.checkSiweSession(mockReq)).not.toThrow();
    });

    it('should throw noSiweSessionError if req is incorrect', async () => {
      const mockReq = { session: {} };

      expect(() => signatureService.checkSiweSession(mockReq)).toThrow(
        noSiweSessionMessage,
      );
    });
  });

  describe('verifyAndGetCookieData', () => {
    it('should return CookieData', async () => {
      const mockSiweMessage = { address: '0x1234' };
      const mockVerify = jest.fn().mockResolvedValue({ data: mockSiweMessage });

      // Mock the SiweMessage class
      jest
        .spyOn(SiweMessage.prototype, 'verify')
        .mockImplementation(mockVerify);

      const message = 'mockMessage';
      const signature = 'mockSignature';
      const nonce = 'mockNonce';

      const result = await signatureService.verifyAndGetCookieData(
        message,
        signature,
        nonce,
      );

      expect(result).toEqual({
        expirationDate: expect.any(Date),
        siweMessage: mockSiweMessage,
      });

      expect(mockVerify).toHaveBeenCalledWith({
        signature: signature,
        nonce: nonce,
      });
    });
  });

  describe('getPersonalInformation', () => {
    it("should get user's address from the SIWE session", () => {
      const address = '0x1234';
      const mockReq = {
        session: {
          siwe: {
            address,
          },
        },
      };
      expect(signatureService.getPersonalInformation(mockReq)).toEqual(address);
    });
  });
});
