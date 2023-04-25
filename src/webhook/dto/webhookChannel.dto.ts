import { IsNotEmpty } from 'class-validator';
import { ChannelDto } from './channel.dto';

export class WebhookChannelDto {
  // do not change name here. this correlates to parsehub json response's prop name.. if want change, change there too
  @IsNotEmpty()
  channel: ChannelDto[];
}
