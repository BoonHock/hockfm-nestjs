import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from './config/typeorm.config';
import { PodcastsModule } from './podcasts/podcasts.module';
import { PlaylistsModule } from './playlists/playlists.module';
import { ChannelsModule } from './channels/channels.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { UtilsModule } from './utils/utils.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PodcastStatusesModule } from './podcast-statuses/podcast-statuses.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PodcastsModule,
    TypeOrmModule.forRootAsync(TypeOrmConfig),
    PlaylistsModule,
    ChannelsModule,
    SubscriptionModule,
    UtilsModule,
    AuthModule,
    UserModule,
    PodcastStatusesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
