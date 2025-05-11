import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Podcast } from './podcast.entity';
import { endOfDay, startOfDay, subDays } from 'date-fns';
import { UserContext } from 'src/models/user-context';
import { SubscriptionService } from 'src/subscription/subscription.service';
import { PodcastStatusEnum } from 'src/common/enum/podcast-status.enum';

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
  ): Promise<Podcast[]> {
    let results: Podcast[] = [];

    // loop few times to attempt to get podcasts. if still don't have, then return empty array
    for (let i = 0; i < 20; i++) {
      const podcasts = this.getPodcastsQuery();

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

      results = await podcasts.getMany();

      if (results.length) {
        break;
      }
    }

    return results;
  }

  async getPodcastById(id: string): Promise<Podcast> {
    return await this.getPodcastsQuery()
      .where('podcast.id = :id', { id: id })
      .getOne();
  }

  private getPodcastsQuery(): SelectQueryBuilder<Podcast> {
    return this.podcastRepository
      .createQueryBuilder('podcast')
      .innerJoinAndSelect('podcast.playlist', 'playlist')
      .innerJoinAndSelect('playlist.channel', 'channel')
      .leftJoinAndSelect('podcast_status', 'ps', 'ps.podcastUuid = podcast.id')
      .select([
        'channel.name',
        'playlist.title',
        'podcast.id',
        'podcast.title',
        'podcast.description',
        'podcast.url',
        'podcast.date',
        'ps.status',
      ])
      .orderBy('podcast.date', 'DESC');
  }
}
