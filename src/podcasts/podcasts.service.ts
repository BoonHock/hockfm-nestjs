import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Podcast } from './podcast.entity';
import { endOfDay, startOfDay, subDays } from 'date-fns';
import { UserContext } from 'src/models/user-context';
import { SubscriptionService } from 'src/subscription/subscription.service';
import { PodcastStatusEnum } from 'src/common/enum/podcast-status.enum';
import { PodcastOutput } from './dto/podcast.dto';

@Injectable()
export class PodcastsService {
  constructor(
    @InjectRepository(Podcast)
    private podcastRepository: Repository<Podcast>,
    private subscriptionService: SubscriptionService,
  ) {}

  async getPodcasts(
    load_more?: string,
    user?: UserContext,
  ): Promise<PodcastOutput[]> {
    let results: {
      podcast_id: string;
      podcast_title: string;
      podcast_description: string;
      podcast_url: string;
      podcast_date: Date;
      playlist_title: string;
      channel_name: string;
      status: PodcastStatusEnum;
    }[] = [];

    // loop few times to attempt to get podcasts. if still don't have, then return empty array
    for (let i = 0; i < 20; i++) {
      const podcasts = this.getPodcastsQuery(user);

      if (user) {
        if (
          (await this.subscriptionService.countSubscriptionsByUser(user.sub)) >
          0
        ) {
          podcasts.innerJoin(
            'subscription',
            'subscription',
            'podcast.playlistUuid = subscription.playlistUuid AND subscription.userUuid = :userUuid',
            { userUuid: user.sub },
          );
        }

        podcasts.where('COALESCE(ps.status, 0) <> :status', {
          status: PodcastStatusEnum.SKIPPED,
        });
      }

      const endDate = endOfDay(
        load_more ? subDays(new Date(load_more), 1) : new Date(),
      );
      const startDate = startOfDay(subDays(endDate, (i + 1) * 3));

      podcasts.andWhere('podcast.date between :startDate and :endDate', {
        startDate: startDate,
        endDate: endDate,
      });

      results = await podcasts.getRawMany();

      if (results.length) {
        break;
      }
    }

    const output = results.map((podcast) => {
      const out: PodcastOutput = {
        id: podcast.podcast_id,
        title: podcast.podcast_title,
        description: podcast.podcast_description,
        url: podcast.podcast_url,
        date: podcast.podcast_date,
        playlist: {
          title: podcast.playlist_title,
          channel: {
            name: podcast.channel_name,
          },
        },
        status: podcast.status || 0,
      };
      return out;
    });

    return output;
  }

  async getPodcastById(id: string): Promise<Podcast> {
    return await this.getPodcastsQuery()
      .where('podcast.id = :id', { id: id })
      .getOne();
  }

  private getPodcastsQuery(user?: UserContext): SelectQueryBuilder<Podcast> {
    return this.podcastRepository
      .createQueryBuilder('podcast')
      .innerJoinAndSelect('podcast.playlist', 'playlist')
      .innerJoinAndSelect('playlist.channel', 'channel')
      .leftJoinAndSelect(
        'podcast_status',
        'ps',
        'ps.podcastUuid = podcast.id AND ps.userUuid = :userUuid',
        {
          userUuid: user?.sub,
        },
      )
      .select([
        'channel.name',
        'playlist.title',
        'podcast.id',
        'podcast.title',
        'podcast.description',
        'podcast.url',
        'podcast.date',
        'coalesce(ps.status, 0) as status',
      ])
      .orderBy('podcast.date', 'DESC');
  }
}
