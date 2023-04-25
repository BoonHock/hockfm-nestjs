import { IsNotEmpty } from 'class-validator';

export class ParsehubRunTokenDto {
  @IsNotEmpty()
  run_token: string;
}
