import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PlaylistDto } from 'src/webhook/dto/playlist.dto';
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

  async getPlaylistByNameAndChannelId(
    name: string,
    channelId: string,
  ): Promise<Playlist> {
    const playlists = await this.playlistRepository.findOne({
      where: {
        title: name,
        channelUuid: channelId,
      },
    });

    return playlists;
  }

  async createPlaylist(createPlaylistDto: CreatePlaylistDto) {
    const playlist = this.playlistRepository.create({
      playlistId: createPlaylistDto.playlistId,
      title: createPlaylistDto.title,
      description: createPlaylistDto.description,
      channelId: createPlaylistDto.channelId,
      play_order: 127, // this was kinda dumped. not updated in any place... but just keep it la. lazy to update
      created_timestamp: createPlaylistDto.created_timestamp,
    });
    await this.playlistRepository.save(playlist);
    return playlist;
  }

  async getPlaylistIds(playlistIds: number[]) {
    const playlists = await this.playlistRepository.find({
      where: playlistIds.map((val) => {
        return { playlistId: val };
      }),
      select: {
        id: true,
      },
    });

    return playlists.map((val) => val.playlistId);
  }

  async getLatestPlaylistId() {
    const playlistId = await this.playlistRepository
      .createQueryBuilder('playlist')
      .select('MAX(playlist.playlistId)', 'maxPlaylistId')
      .getRawOne();

    return playlistId['maxPlaylistId'] ?? 0;
  }

  async createPlaylists(createPlaylistDtos: CreatePlaylistDto[]) {
    const playlists = createPlaylistDtos.map((value) => {
      return this.playlistRepository.create({
        playlistId: value.playlistId,
        title: value.title,
        description: value.description,
        channelId: value.channelId,
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
