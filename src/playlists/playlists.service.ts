import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePlaylistDto } from './dto/createPlaylist.dto';
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

  async createPlaylist(createPlaylistDto: CreatePlaylistDto) {
    const playlist = this.playlistRepository.create({
      title: createPlaylistDto.title,
      description: createPlaylistDto.description,
      play_order: 127, // this was kinda dumped. not updated in any place... but just keep it la. lazy to update
      created_timestamp: createPlaylistDto.created_timestamp,
    });
    await this.playlistRepository.save(playlist);
    return playlist;
  }

  async createPlaylists(createPlaylistDtos: CreatePlaylistDto[]) {
    const playlists = createPlaylistDtos.map((value) => {
      return this.playlistRepository.create({
        title: value.title,
        description: value.description,
        play_order: 127, // this was kinda dumped. not updated in any place... but just keep it la. lazy to update
        created_timestamp: value.created_timestamp,
      });
    });

    const query = this.playlistRepository
      .createQueryBuilder()
      .insert()
      .into(Playlist)
      .values(playlists)
      .orIgnore(true);

    await query.execute();
  }
}
