import { IsNotEmpty } from 'class-validator';

export class CreatePlaylistDto {
  @IsNotEmpty()
  playlistId: number;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  channelId: number;

  @IsNotEmpty()
  created_timestamp: Date;
}
