import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Playlist } from './playlist.entity';

@Injectable()
export class PlaylistsService {
  constructor(
    @InjectRepository(Playlist)
    private playlistRepository: Repository<Playlist>,
  ) {}

  async getPlaylists(): Promise<Playlist[]> {
    const query = this.playlistRepository.createQueryBuilder('playlist');
    const playlists = await query.getMany();
    return playlists;
  }

  async getPlaylistByNameAndChannelUuid(
    name: string,
    channelUuid: string,
  ): Promise<Playlist> {
    const playlists = await this.playlistRepository.findOne({
      where: {
        title: name,
        channelUuid: channelUuid,
      },
    });

    return playlists;
  }
}
