import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { UserContext } from 'src/models/user-context';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  private readonly googleClient: OAuth2Client;
  private readonly clientId: string;
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {
    this.clientId = process.env.GOOGLE_CLIENT_ID;
    this.googleClient = new OAuth2Client(this.clientId);
  }

  async login(credential: string) {
    try {
      const verified = await this.verifyGoogleToken(credential);
      if (!verified) {
        throw new Error('Invalid Google ID token');
      }

      const {
        email,
        name,
        given_name: firstName,
        family_name: lastName,
      } = verified;

      const user = await this.userService.findOrCreateUser({
        email,
        name,
        firstName,
        lastName,
      });
      const jwtToken = this.generateJwt(user, credential);

      return { jwtToken };
    } catch (error) {
      throw new UnauthorizedException('Login failed');
    }
  }

  private async verifyGoogleToken(token: string) {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: token,
        audience: this.clientId, // Optional: verify the audience
      });
      const payload = ticket.getPayload();
      return payload;
    } catch (error) {
      return null;
    }
  }

  private generateJwt(user: User, token: string) {
    const payload: UserContext = {
      sub: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      token,
    };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRATION,
    });
  }
}
