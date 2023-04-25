import { Controller, Post } from '@nestjs/common';
import { Body } from '@nestjs/common/decorators';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
  constructor(private webhookService: WebhookService) {}

  @Post('addNewChannels')
  async addNewChannels(@Body() body: any) {
    await this.webhookService.addNewChannels(body.data);
    return 'OK';
  }

  @Post('addNewPlaylists')
  async addNewPlaylists(@Body() body: any) {
    await this.webhookService.addNewPlaylists(body.data);
    return 'OK';
  }

  @Post('addNewPodcasts')
  async addNewPodcasts(@Body() body: any) {
    await this.webhookService.addNewPodcasts(body.data);
    return 'OK';
  }
}
