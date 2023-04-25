import { Controller, Get } from '@nestjs/common';
import { ChannelsService } from './channels.service';

@Controller('channels')
export class ChannelsController {
  constructor(private channelService: ChannelsService) {}

  @Get('latestChannelId')
  async getLatestChannelId(): Promise<number> {
    return await this.channelService.getLatestChannelId();
  }
}
