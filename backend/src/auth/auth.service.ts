import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {

    constructor(private usersService: UsersService, private jwtService: JwtService    ) {}

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findUsername(username);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload = {sub:user.id, username: user.username };
    return {
      access_token: this.jwtService.sign(payload),
    };
    
  }

  
  async register(registerDto: any): Promise<any> {
    return this.usersService.create(registerDto);
  }

}
