import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from './channel.entity';

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
}
