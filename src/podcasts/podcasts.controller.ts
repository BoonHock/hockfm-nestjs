import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common';
import { updatePodcastStatusDto } from './dto/updatePodcastStatus.dto';
import { Podcast } from './podcast.entity';
import { PodcastsService } from './podcasts.service';

@Controller('podcasts')
export class PodcastsController {
  constructor(private podcastsService: PodcastsService) {}

  @Get()
  async getAllPodcasts(
    @Query('load_more') load_more: string,
  ): Promise<Podcast[]> {
    return await this.podcastsService.getPodcasts(load_more);
  }

  @Get('/:id')
  getPodcastById(@Param('id') podcastId: number): Promise<Podcast> {
    return this.podcastsService.getPodcastById(podcastId);
  }

  @Get('misc/latestPodcastId')
  async getLatestPodcastId(): Promise<number> {
    return await this.podcastsService.getLatestPodcastId();
  }

  @Put(':id/status')
  async updatePodcastStatus(
    @Param('id') podcastId: number,
    @Body() updatePodcastStatusDto: updatePodcastStatusDto,
  ) {
    const { status } = updatePodcastStatusDto;
    await this.podcastsService.updatePodcastStatus(podcastId, status);
    return 'OK';
  }
}
