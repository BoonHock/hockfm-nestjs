import { Module } from '@nestjs/common';
import { SubscriptionListController } from './subscription-list.controller';
import { SubscriptionListService } from './subscription-list.service';

@Module({
  controllers: [SubscriptionListController],
  providers: [SubscriptionListService],
})
export class SubscriptionListModule {}
