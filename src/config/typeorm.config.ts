import { ConfigService } from '@nestjs/config/dist';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { Channel } from 'src/channels/channel.entity';
import { Playlist } from 'src/playlists/playlist.entity';
import { Podcast } from 'src/podcasts/podcast.entity';
import { Subscription } from 'src/subscription/entities/subscription.entity';

export const TypeOrmConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    return {
      type: 'postgres',
      entities: [Podcast, Playlist, Channel, Subscription],
      autoLoadEntities: true,
      synchronize: true,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USER,
      password: process.env.DB_PW,
      database: process.env.DB_NAME,
      ssl: process.env.STAGE === 'prod' ? true : false,
    };
  },
};
