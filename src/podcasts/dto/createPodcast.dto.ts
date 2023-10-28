import { IsNotEmpty } from 'class-validator';
import { PodcastStatus } from '../podcast-status.enum';

export class CreatePodcastDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  url: string;

  @IsNotEmpty()
  date: Date;

  @IsNotEmpty()
  is_real_date: boolean;

  @IsNotEmpty()
  status: PodcastStatus;

  @IsNotEmpty()
  created_timestamp: Date;

  @IsNotEmpty()
  playlistUuid: string;
}
