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
    try {
      const user = await this.usersService.findUsername(username);
      if (user?.password !== pass) {
        this.logger.error(
          `Invalid password for user: ${username}`,
          'AuthService',
        );
        if (!user || !(await bcrypt.compare(pass, user.password))) {
          this.logger.error(
            `Invalid password for user: ${username}`,
            'AuthService',
          );
          throw new UnauthorizedException();
        }
        const payload = { sub: user.id, username: user.username };
        console.log(payload);
        return {
          access_token: this.jwtService.sign(payload),
        };
      }
    } catch (error) {
      this.logger.error(error, error.stack);
      throw new InternalServerErrorException();
    }
  }

  async register(registerDto: any): Promise<any> {
    const existingUser = await this.usersService.findUsername(
      registerDto.username,
    );
    if (existingUser) {
      this.logger.warn(
        `User already exists with username: ${registerDto.username}`,
      );
      throw new UnauthorizedException('User already exists');
    }

    const salt = await bcrypt.genSalt();
    registerDto.password = await bcrypt.hash(registerDto.password, salt);

    return this.usersService.create(registerDto);
  }
}
