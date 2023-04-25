import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ChannelsModule } from 'src/channels/channels.module';
import { PlaylistsModule } from 'src/playlists/playlists.module';
import { PodcastsModule } from 'src/podcasts/podcasts.module';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';

@Module({
  imports: [ChannelsModule, PlaylistsModule, PodcastsModule, HttpModule],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}
