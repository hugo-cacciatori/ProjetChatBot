import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CustomLogger } from 'src/utils/Logger/CustomLogger.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new CustomLogger();

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findUsername(username);
    if (!user || !(await bcrypt.compare(pass, user.password))) {
      this.logger.error(`Invalid password for user: ${username}`, 'AuthService');
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, username: user.username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: any): Promise<any> {
    const existingUser = await this.usersService.findUsername(registerDto.username);
    if (existingUser) {
      this.logger.warn(`User already exists with username: ${registerDto.username}`);
      throw new UnauthorizedException('User already exists');
    }

    const salt = await bcrypt.genSalt();
    registerDto.password = await bcrypt.hash(registerDto.password, salt);

    return this.usersService.create(registerDto);
  }
}
