import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { PodcastStatusEnum } from '../../common/enum/podcast-status.enum';

export class updatePodcastStatusDto {
  @IsNotEmpty()
  @IsEnum(PodcastStatusEnum)
  @Transform(({ value }) => parseInt(value)) // not working 100% as expected...
  status: PodcastStatusEnum;
}
