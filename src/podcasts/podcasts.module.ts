import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from 'src/subscription/subscription.entity';
import { Podcast } from './podcast.entity';
import { PodcastsController } from './podcasts.controller';
import { PodcastsService } from './podcasts.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Podcast]),
    TypeOrmModule.forFeature([Subscription]),
  ],
  controllers: [PodcastsController],
  providers: [PodcastsService],
  exports: [PodcastsService],
})
export class PodcastsModule {}
