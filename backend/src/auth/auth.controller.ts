import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { Body, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { RegisterAccountRequestDto } from './dto/register-account-request.dto';
import { CustomLogger } from 'src/utils/Logger/CustomLogger.service';

@Controller('auth')
export class AuthController {

  private readonly logger = new CustomLogger();
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    this.logger.log(`User attempting to sign in with username: ${signInDto.username}`);
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  getProfile(@Request() req) {
    return req.user;
  }

  // create a new user
  @Post('register')
  register(@Body() registerAccountRequestDto: RegisterAccountRequestDto) {
    this.logger.log(`new user attempting to register with username: ${registerAccountRequestDto.username}`);
    
    return this.authService.register(registerAccountRequestDto);
  }
}
