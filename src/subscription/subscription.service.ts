import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from 'src/channels/channel.entity';
import { UtilsModule } from 'src/utils/utils.module';
import { Repository } from 'typeorm';
import { CreateSubscriptionDto } from './dto/createSubscription.dto';
import { GetSubscriptionDto } from './dto/getSubscription.dto';
import { Subscription } from './subscription.entity';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
  ) {}

  async getSubscriptions(): Promise<GetSubscriptionDto[]> {
    const subscriptionQuery = this.channelRepository
      .createQueryBuilder('c')
      .innerJoinAndSelect('c.playlist', 'p')
      .leftJoinAndSelect('p.subscription', 's')
      .orderBy('c.name')
      .addOrderBy('p.title')
      .select([
        'c.id AS channel',
        'c.name AS channel_name',
        'p.id AS playlist',
        'p.title AS playlist_name',
        'p.description AS description',
        'CASE WHEN s.playlistUuid IS NULL THEN false ELSE true END AS is_subscribed',
      ]);

    return subscriptionQuery.getRawMany();
  }

  async saveSubscription(createSubscriptionDto: CreateSubscriptionDto) {
    await this.subscriptionRepository.clear();

    const klTime = UtilsModule.getKlTimeNow();

    const subs = createSubscriptionDto.subscribe_playlist.map((value) => {
      return this.subscriptionRepository.create({
        playlistUuid: value,
        created_timestamp: klTime,
      });
    });

    this.subscriptionRepository.create(subs);

    await this.subscriptionRepository.save(subs);
  }
}
