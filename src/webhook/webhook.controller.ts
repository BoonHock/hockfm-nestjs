import { Controller, Post, Get, Query } from '@nestjs/common';
import { Body } from '@nestjs/common/decorators';
import { WebhookService } from './webhook.service';
import { CreateChannelDto } from 'src/channels/dto/createChannel.dto';
import { CreatePlaylistDto } from 'src/playlists/dto/createPlaylist.dto';
import { CreatePodcastDto } from 'src/podcasts/dto/createPodcast.dto';

@Controller('webhook')
export class WebhookController {
  constructor(private webhookService: WebhookService) {}

  @Post('addNewChannels')
  async addNewChannels(@Body() body: CreateChannelDto[]) {
    await this.webhookService.addNewChannels(body);
    return 'OK';
  }

  @Post('addNewPlaylists')
  async addNewPlaylists(@Body() body: CreatePlaylistDto[]) {
    await this.webhookService.addNewPlaylists(body);
    return 'OK';
  }

  @Post('addNewPodcasts')
  async addNewPodcasts(@Body() body: CreatePodcastDto[]) {
    let response = 'OK';
    try {
      await this.webhookService.addNewPodcasts(body);
    } catch (e) {
      response = JSON.stringify(e);
    }
    return response;
  }

  @Post('loadParsehubToDB')
  async loadParsehubToDB(@Query('runToken') runToken: string) {
    let response = {};
    try {
      response = {
        status: 'OK',
        data: await this.webhookService.loadParsehubToDB(runToken),
      };
    } catch (e) {
      response = {
        status: 'ERROR',
        data: e,
      };
    }
    return response;
  }
}
