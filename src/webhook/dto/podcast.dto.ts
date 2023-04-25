import { IsNotEmpty } from 'class-validator';
import { PodcastStatus } from 'src/podcasts/podcast-status.enum';

export class PodcastDto {
  @IsNotEmpty()
  podcastId: number;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  date: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  url: string;

  @IsNotEmpty()
  playlistId: number;

  podcastDate: Date;

  is_real_date: boolean;

  status: PodcastStatus;

  created_timestamp: Date;
}
