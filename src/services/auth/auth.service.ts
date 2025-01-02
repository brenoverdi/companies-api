import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'; // JwtService import
import * as bcrypt from 'bcryptjs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../services/users/schema/user.schema';
import { JwtPayload } from '../../helpers/jwt.strategy.helper';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {
    console.log('AuthService initialized');
  }

  // Sign up (Register) a new user
  async signup(username: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    const newUser = new this.userModel({ username, password: hashedPassword });
    return await newUser.save();
  }
  // Login a user
  async login(username: string, password: string): Promise<string> {
    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Generate JWT token
    const payload: JwtPayload = {
      username: user.username,
      sub: user._id as unknown as string,
    };
    return this.jwtService.sign(payload); // Use JwtService to sign the token
  }

  // Validate JWT token
  async validateUser(payload: JwtPayload): Promise<User> {
    return this.userModel.findOne({ _id: payload.sub });
  }
}
