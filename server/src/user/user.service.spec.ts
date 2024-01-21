import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { SignatureService } from '../signature/signature.service';
import { User } from './user.entity';

describe('UserService', () => {
  let userService: UserService;
  let signatureService: SignatureService;
  const mockedRepository = {
    find: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockResolvedValue(null),
    save: jest.fn().mockResolvedValue(null),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [
        UserService,
        SignatureService,
        {
          provide: 'UserRepository',
          useValue: mockedRepository,
        },
      ],
    }).compile();

    mockedRepository.find.mockClear();
    userService = module.get<UserService>(UserService);
    signatureService = module.get<SignatureService>(SignatureService);
  });

  describe('getAllUsers', () => {
    it('should find users in database and return them without addresses', async () => {
      const savedUsers: User[] = [
        {
          address: '0x1234',
          name: 'name 0',
          bio: 'bio 0',
          image: 'image 0',
        },
        {
          address: '0x1235',
          name: 'name 1',
          bio: 'bio 1',
          image: 'image 1',
        },
      ];
      jest
        .spyOn(mockedRepository, 'find')
        .mockImplementation(() => Promise.resolve(savedUsers));
      const users = await userService.getAllUsers();
      const expectedResult = savedUsers.map(({ address: _, ...user }) => user);
      expect(users).toEqual(expectedResult);
    });
  });

  describe('getProfile', () => {
    it("should check SIWE session and retrieve the user's profile", async () => {
      const address = '0x1234';
      const mockReq = {
        session: {
          siwe: {
            address,
          },
        },
      };
      const userInDb = {
        address: '0x1234',
        name: 'name 0',
        bio: 'bio 0',
        image: 'image 0',
      };
      jest
        .spyOn(mockedRepository, 'findOne')
        .mockImplementation(() => Promise.resolve(userInDb));
      jest.spyOn(signatureService, 'checkSiweSession');

      const result = await userService.getProfile(mockReq);
      expect(result).toEqual(userInDb);

      expect(signatureService.checkSiweSession).toHaveBeenCalledWith(mockReq);
    });
  });

  describe('saveUser', () => {
    it('should check SIWE session and save the user in DB', async () => {
      const address = '0x1234';
      const mockReq = {
        session: {
          siwe: {
            address,
          },
        },
      };
      const savedUser = {
        address,
        name: 'name 0',
        bio: 'bio 0',
        image: 'image 0',
      };
      jest
        .spyOn(mockedRepository, 'save')
        .mockImplementation(() => Promise.resolve(savedUser));
      jest.spyOn(signatureService, 'checkSiweSession');

      const result = await userService.saveUser(mockReq);
      expect(result).toEqual(savedUser);

      expect(signatureService.checkSiweSession).toHaveBeenCalledWith(mockReq);
    });
  });
});
