import { Body, Controller } from '@nestjs/common';
import {
  Get,
  Post,
} from '@nestjs/common/decorators/http/request-mapping.decorator';
import { CreateSubscriptionDto } from './dto/createSubscription.dto';
import { GetSubscriptionDto } from './dto/getSubscription.dto';
import { SubscriptionService } from './subscription.service';
import { UserContext } from 'src/models/user-context';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Controller('subscription')
export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {}

  @Get()
  async getSubscriptions(
    @CurrentUser() user: UserContext,
  ): Promise<GetSubscriptionDto[]> {
    return await this.subscriptionService.getSubscriptions(user.sub);
  }

  @Post()
  async postSubscription(
    @Body() createSubscriptionDto: CreateSubscriptionDto,
    @CurrentUser() user: UserContext,
  ): Promise<string> {
    await this.subscriptionService.saveSubscription(
      createSubscriptionDto,
      user,
    );
    return 'OK';
  }
}
