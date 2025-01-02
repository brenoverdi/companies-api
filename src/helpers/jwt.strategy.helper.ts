import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from '../services/auth/auth.service';

export interface JwtPayload {
  username: string;
  sub: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract JWT from Bearer token
      ignoreExpiration: false,
      secretOrKey: 'your_secret_key', // Same secret as in JwtModule
    });
  }

  // Validate the JWT and extract user info
  async validate(payload: any) {
    return { userId: payload.userId }; // Here, you can also fetch more user data from MongoDB if needed
  }
}
