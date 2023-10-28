import { Controller, Get } from '@nestjs/common';
import { Playlist } from './playlist.entity';
import { PlaylistsService } from './playlists.service';

@Controller('playlists')
export class PlaylistsController {
  constructor(private playlistsService: PlaylistsService) {}

  @Get()
  getAllPlaylists(): Promise<Playlist[]> {
    return this.playlistsService.getPlaylists();
  }
}
