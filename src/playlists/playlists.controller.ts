import { Controller, Get } from '@nestjs/common';
import { Playlist } from './playlist.entity';
import { PlaylistsService } from './playlists.service';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('playlists')
export class PlaylistsController {
  constructor(private playlistsService: PlaylistsService) {}

  @Get()
  @Public()
  getAllPlaylists(): Promise<Playlist[]> {
    return this.playlistsService.getPlaylists();
  }
}
