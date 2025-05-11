import { Controller, Get, Param, Query } from '@nestjs/common';
import { Podcast } from './podcast.entity';
import { PodcastsService } from './podcasts.service';
import { Public } from 'src/auth/decorators/public.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserContext } from 'src/models/user-context';
import { PodcastOutput } from './dto/podcast.dto';

@Controller('podcasts')
export class PodcastsController {
  constructor(private podcastsService: PodcastsService) {}

  @Get()
  @Public()
  async getAllPodcasts(
    @Query('load_more') load_more: string,
    @CurrentUser() user?: UserContext,
  ): Promise<PodcastOutput[]> {
    return await this.podcastsService.getPodcasts(load_more, user);
  }

  @Get('/:id')
  @Public()
  getPodcastById(@Param('id') id: string): Promise<Podcast> {
    return this.podcastsService.getPodcastById(id);
  }
}
