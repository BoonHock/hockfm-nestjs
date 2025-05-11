import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Podcast } from './podcast.entity';
import { PodcastsController } from './podcasts.controller';
import { PodcastsService } from './podcasts.service';
import { SubscriptionModule } from 'src/subscription/subscription.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Podcast]), SubscriptionModule, JwtModule],
  controllers: [PodcastsController],
  providers: [
    PodcastsService,
    AuthGuard,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  exports: [PodcastsService],
})
export class PodcastsModule {}
