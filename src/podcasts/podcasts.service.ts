import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscription } from 'src/subscription/subscription.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { PodcastStatus } from './podcast-status.enum';
import { Podcast } from './podcast.entity';

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

    if (load_more) {
      const endDate = new Date(load_more);
      endDate.setDate(endDate.getDate() - 1);
      const startDate = new Date(endDate.getTime());
      startDate.setDate(startDate.getDate() - 6);
      podcasts.andWhere('podcast.date between :startDate and :endDate', {
        startDate: startDate,
        endDate: endDate,
      });
    }

    if ((await this.subscriptionRepository.count()) > 0) {
      podcasts.innerJoin(
        'subscription',
        'subscription',
        'podcast.playlistUuid = subscription.playlistUuid',
      );
    }

    return podcasts.getMany();
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
      .orderBy('podcast.date', 'DESC')
      .limit(50);
  }
}
