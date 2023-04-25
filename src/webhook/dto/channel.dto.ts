import { IsNotEmpty } from 'class-validator';
import { PlaylistDto } from './playlist.dto';

export class ChannelDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  name: string;

  // do not change name here. this correlates to parsehub json response's prop name.. if want change, change there too
  @IsNotEmpty()
  playlist: PlaylistDto[];
}
