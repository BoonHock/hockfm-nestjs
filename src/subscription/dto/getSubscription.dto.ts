import { IsNotEmpty } from 'class-validator';

export class GetSubscriptionDto {
  @IsNotEmpty()
  channel: number;
  @IsNotEmpty()
  channel_name: string;
  @IsNotEmpty()
  playlist: number;
  @IsNotEmpty()
  playlist_name: string;
  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  is_subscribed: boolean;
}
