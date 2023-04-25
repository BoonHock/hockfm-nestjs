import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { PodcastStatus } from '../podcast-status.enum';

export class updatePodcastStatusDto {
  @IsNotEmpty()
  @IsEnum(PodcastStatus)
  @Transform(({ value }) => parseInt(value)) // not working 100% as expected...
  status: PodcastStatus;
}
