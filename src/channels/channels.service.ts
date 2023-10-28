import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

  async createChannel(createChannelDto: CreateChannelDto) {
    const channel = this.channelRepository.create({
      name: createChannelDto.name,
      created_timestamp: createChannelDto.created_timestamp,
    });
    await this.channelRepository.save(channel);
    return channel;
  }

  async createChannels(createChannelDtos: CreateChannelDto[]) {
    const channels = createChannelDtos.map((value) => {
      return this.channelRepository.create({
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
