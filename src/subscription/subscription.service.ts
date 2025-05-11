import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from 'src/channels/channel.entity';
import { UtilsModule } from 'src/utils/utils.module';
import { Repository } from 'typeorm';
import { CreateSubscriptionDto } from './dto/createSubscription.dto';
import { GetSubscriptionDto } from './dto/getSubscription.dto';
import { Subscription } from './entities/subscription.entity';
import { UserContext } from 'src/models/user-context';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
  ) {}

  async getSubscriptions(userUuid: string): Promise<GetSubscriptionDto[]> {
    const subscriptionQuery = this.channelRepository
      .createQueryBuilder('c')
      .innerJoinAndSelect('c.playlist', 'p')
      .leftJoinAndSelect(
        'p.subscription',
        's',
        'p.id = s.playlistUuid AND s.userUuid = :userUuid',
        {
          userUuid,
        },
      )
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

  async saveSubscription(
    createSubscriptionDto: CreateSubscriptionDto,
    user: UserContext,
  ) {
    // clear all subscriptions for the user
    await this.subscriptionRepository.delete({
      userUuid: user.sub,
    });

    const klTime = UtilsModule.getKlTimeNow();

    const subs = createSubscriptionDto.subscribe_playlist.map((value) => {
      return this.subscriptionRepository.create({
        playlistUuid: value,
        userUuid: user.sub,
        createdAt: klTime,
      });
    });

    this.subscriptionRepository.create(subs);

    await this.subscriptionRepository.save(subs);
  }

  async countSubscriptionsByUser(userUuid: string): Promise<number> {
    return await this.subscriptionRepository.count({
      where: {
        userUuid,
      },
    });
  }
}
