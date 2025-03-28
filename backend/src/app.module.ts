import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ExampleModule } from './example/example.module';
import { GeneratedRequestModule } from './generated-request/generated-request.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LlmModule } from './llm/llm.module';
import dbConfiguration from './config/db.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [dbConfiguration],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
      }),
    }),
    AuthModule,
    UsersModule,
    ExampleModule,
    GeneratedRequestModule,
    LlmModule,
  ],
  providers: [AppService],
})
export class AppModule {}
