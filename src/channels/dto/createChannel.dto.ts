import { IsNotEmpty } from 'class-validator';

export class CreateChannelDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  created_timestamp: Date;
}
