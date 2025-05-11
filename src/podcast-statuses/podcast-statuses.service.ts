import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PodcastStatusEnum } from 'src/common/enum/podcast-status.enum';
import { PodcastStatus } from './entities/podcast-statuses.entity';
import { Repository } from 'typeorm';
import { UserContext } from 'src/models/user-context';

@Injectable()
export class PodcastStatusesService {
  constructor(
    @InjectRepository(PodcastStatus)
    private podcastStatusRepository: Repository<PodcastStatus>,
  ) {}

  async updatePodcastStatus(
    podcastUuid: string,
    status: PodcastStatusEnum,
    user: UserContext,
  ) {
    await this.podcastStatusRepository.delete({
      userUuid: user.sub,
      podcastUuid: podcastUuid,
    });
    const ps = this.podcastStatusRepository.create({
      userUuid: user.sub,
      podcastUuid: podcastUuid,
      status: status,
      createdAt: new Date(),
    });
    return this.podcastStatusRepository.save(ps);
  }
}
