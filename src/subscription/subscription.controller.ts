import { Body, Controller } from '@nestjs/common';
import {
  Get,
  Post,
} from '@nestjs/common/decorators/http/request-mapping.decorator';
import { CreateSubscriptionDto } from './dto/createSubscription.dto';
import { GetSubscriptionDto } from './dto/getSubscription.dto';
import { SubscriptionService } from './subscription.service';

@Controller('subscription')
export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {}

  @Get()
  async getSubscriptions(): Promise<GetSubscriptionDto[]> {
    return await this.subscriptionService.getSubscriptions();
  }

  @Post()
  async postSubscription(
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<string> {
    await this.subscriptionService.saveSubscription(createSubscriptionDto);
    return 'OK';
  }
}
