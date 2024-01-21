import {Controller, Get, Post, Req, Res} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  getAllUsers(@Res() res) {
    return this.userService.getAllUsers(res);
  }

  @Get('/profile')
  getProfile(@Req() req, @Res() res) {
    return this.userService.getProfile(req, res);
  }

  @Post()
  async saveUser(@Req() req, @Res() res) {
    await this.userService.saveUser(req, res);
  }
}
