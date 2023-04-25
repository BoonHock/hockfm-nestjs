import { IsNotEmpty } from 'class-validator';
import { PodcastDto } from './podcast.dto';

export class PlaylistDto {
  @IsNotEmpty()
  playlistId: number;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  channelId: number;

  // do not change name here. this correlates to parsehub json response's prop name.. if want change, change there too
  @IsNotEmpty()
  item: PodcastDto[];
}
