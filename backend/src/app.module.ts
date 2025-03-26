import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ExampleModule } from './example/example.module';
import { GeneratedRequestModule } from './generated-request/generated-request.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import dbConfiguration from './config/db.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './src/config/.env.old.dev',
      load: [dbConfiguration],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
      }),
    }),
    ExampleModule,
    GeneratedRequestModule,
  ],
  providers: [AppService],
})
export class AppModule {}
