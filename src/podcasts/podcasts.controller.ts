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
  getPodcastById(@Param('id') id: string): Promise<Podcast> {
    return this.podcastsService.getPodcastById(id);
  }

  @Put(':id/status')
  async updatePodcastStatus(
    @Param('id') id: string,
    @Body() updatePodcastStatusDto: updatePodcastStatusDto,
  ) {
    const { status } = updatePodcastStatusDto;
    await this.podcastsService.updatePodcastStatus(id, status);
    return 'OK';
  }
}
