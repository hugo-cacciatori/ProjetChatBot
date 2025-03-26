import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';    
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { SetMetadata } from '@nestjs/common';




@Module({
  imports: [UsersModule,
    JwtModule.register({
        global: true,
        secret: jwtConstants.secret, //TODO: move to .env
        signOptions: { expiresIn: '60s' },
      }),
  
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
