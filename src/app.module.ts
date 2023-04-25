import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from './config/typeorm.config';
import { PodcastsModule } from './podcasts/podcasts.module';
import { PlaylistsModule } from './playlists/playlists.module';
import { ChannelsModule } from './channels/channels.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { WebhookModule } from './webhook/webhook.module';
import { SubscriptionListModule } from './subscription-list/subscription-list.module';
import { UtilsModule } from './utils/utils.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
    }),
    PodcastsModule,
    TypeOrmModule.forRootAsync(TypeOrmConfig),
    PlaylistsModule,
    ChannelsModule,
    SubscriptionModule,
    WebhookModule,
    SubscriptionListModule,
    UtilsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
