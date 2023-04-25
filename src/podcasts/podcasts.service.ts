import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscription } from 'src/subscription/subscription.entity';
import { PodcastDto } from 'src/webhook/dto/podcast.dto';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreatePodcastDto } from './dto/createPodcast.dto';
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

  async getPodcasts(load_more: number | null): Promise<Podcast[]> {
    const podcasts = this.getPodcastsQuery()
      .where('podcast.status <> :status', { status: PodcastStatus.SKIPPED })
      .andWhere(load_more ? 'podcast.podcastId < :load_more' : '1=1', {
        load_more: load_more,
      });
    // .andWhere(
    //   '((SELECT COUNT(*) FROM subscription) = 0 OR (podcast.playlistId IN (SELECT subscription.playlistId FROM subscription)))',
    // );

    if ((await this.subscriptionRepository.count()) > 0) {
      podcasts.innerJoin(
        'subscription',
        'subscription',
        'podcast.playlistId = subscription.playlistId',
      );
    }

    return podcasts.getMany();
  }

  async getPodcastById(podcastId: number): Promise<Podcast> {
    return await this.getPodcastsQuery()
      .where('podcast.podcastId = :id', { id: podcastId })
      .getOne();
  }

  async getPodcastIds(podcastIds: number[]) {
    const podcasts = await this.podcastRepository.find({
      where: podcastIds.map((val) => {
        return { podcastId: val };
      }),
      select: {
        id: true,
      },
    });

    return podcasts.map((val) => val.podcastId);
  }

  async getLatestPodcastId(): Promise<number> {
    const podcast = await this.podcastRepository
      .createQueryBuilder('podcast')
      .select('MAX(podcast.podcastId)', 'maxPodcastId')
      .getRawOne();

    return podcast['maxPodcastId'] ?? 0;
  }

  async createPodcasts(
    createPodcastDtos: CreatePodcastDto[],
  ): Promise<Podcast[]> {
    const podcasts = createPodcastDtos.map((value) => {
      return this.podcastRepository.create({
        ...value,
      });
    }, []);

    const query = this.podcastRepository
      .createQueryBuilder()
      .insert()
      .into(Podcast)
      .values(podcasts)
      .orIgnore(true);

    await query.execute();

    return podcasts;
  }

  async updatePodcastStatus(podcastId: number, status: PodcastStatus) {
    const podcast = await this.podcastRepository.findOne({
      where: { podcastId: podcastId },
    });

    if (podcast) {
      podcast.status = status;
      await this.podcastRepository.save(podcast);
    } else {
      throw new NotFoundException(`No podcast found for Id ${podcastId}`);
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
        'podcast.podcastId',
        'podcast.title',
        'podcast.description',
        'podcast.url',
        'podcast.date',
        'podcast.status',
      ])
      .orderBy('podcast.podcastId', 'DESC')
      .limit(50);
  }
}
