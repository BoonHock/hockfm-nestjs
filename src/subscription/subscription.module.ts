import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from 'src/channels/channel.entity';
import { SubscriptionController } from './subscription.controller';
import { Subscription } from './entities/subscription.entity';
import { SubscriptionService } from './subscription.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscription]),
    TypeOrmModule.forFeature([Channel]),
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
