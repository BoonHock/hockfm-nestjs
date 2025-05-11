import { Module } from '@nestjs/common';
import { PodcastStatusesController } from './podcast-statuses.controller';
import { PodcastStatusesService } from './podcast-statuses.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PodcastStatus } from './entities/podcast-statuses.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PodcastStatus])],
  controllers: [PodcastStatusesController],
  providers: [PodcastStatusesService],
})
export class PodcastStatusesModule {}
