import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    authorization?: any;
  }
}
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: FastifyRequest, res: FastifyReply, next: () => void) {
    console.log('Passing thorugh AuthMiddleware');
    const token = req.headers['authorization']?.split(' ')[1]; // Get token from Authorization header

    if (!token) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    try {
      // Verify and decode the token
      console.log('Verifying token...');
      const decoded = await this.jwtService.verifyAsync(token);
      req.authorization = decoded; // Attach user data to the request (if needed)
      console.log('Token verfiied:', decoded);
      next();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new HttpException(
        'Invalid or expired token',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
