import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async createUser(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    return this.userService.create(username, password);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':username')
  async findUser(@Param('username') username: string) {
    return this.userService.findOne(username);
  }
}
