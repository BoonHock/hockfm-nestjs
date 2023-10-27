import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelDto } from 'src/webhook/dto/channel.dto';
import { WebhookChannelDto } from 'src/webhook/dto/webhookChannel.dto';
import { Repository } from 'typeorm';
import { Channel } from './channel.entity';
import { CreateChannelDto } from './dto/createChannel.dto';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
  ) {}

  async getChannelByName(name: string): Promise<Channel> {
    return await this.channelRepository.findOne({
      where: {
        name: name,
      },
    });
  }

  async getChannelIds(channelIds: number[]) {
    const channel = await this.channelRepository.find({
      where: channelIds.map((val) => {
        return { channelId: val };
      }),
      select: {
        id: true,
      },
    });

    return channel.map((val) => val.channelId);
  }

  async getLatestChannelId(): Promise<number> {
    const channelId = await this.channelRepository
      .createQueryBuilder('channel')
      .select('MAX(channel.channelId)', 'maxChannelId')
      .getRawOne();

    return channelId['maxChannelId'] ?? 0;
  }

  async createChannel(createChannelDto: CreateChannelDto) {
    const channel = this.channelRepository.create({
      channelId: createChannelDto.channelId,
      name: createChannelDto.name,
      created_timestamp: createChannelDto.created_timestamp,
    });
    await this.channelRepository.save(channel);
    return channel;
  }

  async createChannels(createChannelDtos: CreateChannelDto[]) {
    const channels = createChannelDtos.map((value) => {
      return this.channelRepository.create({
        channelId: value.channelId,
        name: value.name,
        created_timestamp: value.created_timestamp,
      });
    });

    const query = this.channelRepository
      .createQueryBuilder()
      .insert()
      .into(Channel)
      .values(channels)
      .orIgnore(true);

    await query.execute();
  }
}
