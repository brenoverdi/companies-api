import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt'; // Import the JwtModule
import { AuthService } from '../services/auth/auth.service';
import { AuthController } from '../controllers/auth/auth.controller';
import { UserSchema, User } from 'src/services/users/schema/user.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default-secret', // Ensure you have a secret here
      signOptions: { expiresIn: '1h' }, // Customize the token expiration time
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService, JwtModule], // Export JwtService if needed elsewhere
})
export class AuthModule {}
