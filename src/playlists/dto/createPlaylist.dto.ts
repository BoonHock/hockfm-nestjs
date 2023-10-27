import { IsNotEmpty } from 'class-validator';

export class CreatePlaylistDto {
  @IsNotEmpty()
  channelUuid: string;

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
