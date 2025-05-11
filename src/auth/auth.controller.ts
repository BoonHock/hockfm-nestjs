import { Body, Controller, Post, Redirect } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Redirect(process.env.AUTH_REDIRECT_URL, 302)
  @Public()
  async login(
    @Body() googleLoginDto: { credential: string; g_csrf_token: string },
  ) {
    const { credential } = googleLoginDto;
    const { jwtToken } = await this.authService.login(credential);
    return { url: `${process.env.AUTH_REDIRECT_URL}/?token=${jwtToken}` };
  }
}
