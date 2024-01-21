import { Controller, Get, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { handleNoSiweSessionError } from '../utils/errorHandler';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  async getAllUsers(@Res() res) {
    try {
      const users = await this.userService.getAllUsers();
      res.status(HttpStatus.OK);
      res.send(users);
    } catch (e) {
      res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/profile')
  async getProfile(@Req() req, @Res() res) {
    try {
      const user = await this.userService.getProfile(req);
      if (user) {
        res.status(HttpStatus.OK);
        res.send(user);
      } else {
        res.sendStatus(HttpStatus.NOT_FOUND);
      }
    } catch (e) {
      handleNoSiweSessionError(e, res);
    }
  }

  @Post()
  async saveUser(@Req() req, @Res() res) {
    try {
      const user = await this.userService.saveUser(req);
      res.status(HttpStatus.CREATED);
      res.send(user);
    } catch (e) {
      handleNoSiweSessionError(e, res);
    }
  }
}
