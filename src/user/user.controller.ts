import { Controller, Get } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserContext } from 'src/models/user-context';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async currentUser(@CurrentUser() user: UserContext) {
    return this.userService.findUserById(user.sub);
  }
}
