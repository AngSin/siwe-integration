import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UsersResponse } from './user.types';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;
  const mockedRepository = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: 'UserRepository',
          useValue: mockedRepository,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  describe('GET /', () => {
    it('should return the users found by the service layeer', async () => {
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
  });
});
