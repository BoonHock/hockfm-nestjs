import { IsNotEmpty } from 'class-validator';

export class CreateChannelDto {
  @IsNotEmpty()
  channelId: number;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  created_timestamp: Date;
}
