import { Controller, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  async getAll(@Query() query: CreateUserDto) {
    return this.userService.getAllUsers(query);
  }
  // @Get()
  // async getAllUs() {
  //   return this.userService.getAll();
  // }
}
