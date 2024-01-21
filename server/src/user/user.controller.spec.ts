import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UsersResponse } from './user.types';
import { SignatureService } from '../signature/signature.service';
import { User } from './user.entity';
import * as errorUtils from '../utils/errorHandler';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let signatureService: SignatureService;
  const mockedRepository = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        SignatureService,
        {
          provide: 'UserRepository',
          useValue: mockedRepository,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
    signatureService = module.get<SignatureService>(SignatureService);
  });

  describe('GET /', () => {
    it('should return the users found by the service layer', async () => {
      const mockRes = {
        status: jest.fn(),
        send: jest.fn(),
      };

      const result: UsersResponse = [
        {
          name: 'Mock User',
          bio: 'Mock Bio',
          image: 'Mock Image',
        },
      ];

      jest
        .spyOn(userService, 'getAllUsers')
        .mockImplementation(() => Promise.resolve(result));

      await controller.getAllUsers(mockRes);

      expect(userService.getAllUsers).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith([
        {
          name: 'Mock User',
          bio: 'Mock Bio',
          image: 'Mock Image',
        },
      ]);
    });

    it('should return a 500 if service layer fails', async () => {
      const mockRes = {
        sendStatus: jest.fn(),
      };
      jest.spyOn(userService, 'getAllUsers').mockImplementation(() => {
        throw Error();
      });

      await controller.getAllUsers(mockRes);

      expect(userService.getAllUsers).toHaveBeenCalled();
      expect(mockRes.sendStatus).toHaveBeenCalledWith(500);
    });
  });

  describe('POST /', () => {
    it('should save the user via the service layer', async () => {
      const mockReq = {};
      const mockRes = {
        status: jest.fn(),
        send: jest.fn(),
      };
      const mockedResult: User = {
        address: '0x1234',
        name: 'mock name',
        bio: 'mock bio',
        image: 'mock image',
      };
      jest
        .spyOn(userService, 'saveUser')
        .mockImplementation(() => Promise.resolve(mockedResult));
      await controller.saveUser(mockReq, mockRes);

      expect(userService.saveUser).toHaveBeenCalledWith(mockReq);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.send).toHaveBeenCalledWith(mockedResult);
    });

    it('should call `handleNoSiweSessionError` if service layer fails', async () => {
      const mockReq = {};
      const mockRes = {};
      jest.spyOn(userService, 'saveUser').mockImplementation(() => {
        throw new Error();
      });
      jest
        .spyOn(errorUtils, 'handleNoSiweSessionError')
        .mockImplementation(() => {});

      await controller.saveUser(mockReq, mockRes);

      expect(userService.saveUser).toHaveBeenCalledWith(mockReq);
      expect(errorUtils.handleNoSiweSessionError).toHaveBeenCalled();
    });
  });

  describe('GET /profile', () => {
    it('should return 200 if user is found', async () => {
      const mockReq = {};
      const mockRes = {
        status: jest.fn(),
        send: jest.fn(),
      };

      const result = {
        address: '0x1234',
        name: 'mock name',
        bio: 'mock bio',
        image: 'mock image',
      };

      jest
        .spyOn(userService, 'getProfile')
        .mockImplementation(() => Promise.resolve(result));

      await controller.getProfile(mockReq, mockRes);

      expect(userService.getProfile).toHaveBeenCalledWith(mockReq);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith(result);
    });

    it('should return 404 if user is not found', async () => {
      const mockReq = {};
      const mockRes = {
        sendStatus: jest.fn(),
      };

      jest
        .spyOn(userService, 'getProfile')
        .mockImplementation(() => Promise.resolve(null));

      await controller.getProfile(mockReq, mockRes);

      expect(userService.getProfile).toHaveBeenCalledWith(mockReq);
      expect(mockRes.sendStatus).toHaveBeenCalledWith(404);
    });
  });
});
