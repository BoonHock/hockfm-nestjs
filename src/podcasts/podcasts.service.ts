import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscription } from 'src/subscription/subscription.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { PodcastStatus } from './podcast-status.enum';
import { Podcast } from './podcast.entity';
import { endOfDay, startOfDay, subDays } from 'date-fns';

@Injectable()
export class PodcastsService {
  constructor(
    @InjectRepository(Podcast)
    private podcastRepository: Repository<Podcast>,
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
  ) {}

  async getPodcasts(load_more?: string): Promise<Podcast[]> {
    const podcasts = this.getPodcastsQuery().where(
      'podcast.status <> :status',
      { status: PodcastStatus.SKIPPED },
    );

    if ((await this.subscriptionRepository.count()) > 0) {
      podcasts.innerJoin(
        'subscription',
        'subscription',
        'podcast.playlistUuid = subscription.playlistUuid',
      );
    }

    let results: Podcast[] = [];

    // loop few times to attempt to get podcasts. if still don't have, then return empty array
    for (let i = 0; i < 20; i++) {
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

  async updatePodcastStatus(id: string, status: PodcastStatus) {
    const podcast = await this.podcastRepository.findOne({
      where: { id: id },
    });

    if (podcast) {
      podcast.status = status;
      await this.podcastRepository.save(podcast);
    } else {
      throw new NotFoundException(`No podcast found for Id ${id}`);
    }
  }

  private getPodcastsQuery(): SelectQueryBuilder<Podcast> {
    return this.podcastRepository
      .createQueryBuilder('podcast')
      .innerJoinAndSelect('podcast.playlist', 'playlist')
      .innerJoinAndSelect('playlist.channel', 'channel')
      .select([
        'channel.name',
        'playlist.title',
        'podcast.id',
        'podcast.title',
        'podcast.description',
        'podcast.url',
        'podcast.date',
        'podcast.status',
      ])
      .orderBy('podcast.date', 'DESC');
  }
}
