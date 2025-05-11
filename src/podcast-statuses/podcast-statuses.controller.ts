import { Body, Controller, Param, Post } from '@nestjs/common';
import { updatePodcastStatusDto } from './dto/updatePodcastStatus.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserContext } from 'src/models/user-context';
import { PodcastStatusesService } from './podcast-statuses.service';

@Controller('podcast-statuses')
export class PodcastStatusesController {
  constructor(private podcastStatusesService: PodcastStatusesService) {}

  @Post(':id')
  async updatePodcastStatus(
    @Param('id') id: string,
    @Body() updatePodcastStatusDto: updatePodcastStatusDto,
    @CurrentUser() user: UserContext,
  ) {
    const { status } = updatePodcastStatusDto;
    await this.podcastStatusesService.updatePodcastStatus(id, status, user);
    return 'OK';
  }
}
