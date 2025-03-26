import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppRouter } from './app.router';
import { TRPCModule } from 'nestjs-trpc';
import { TrpcPanelController } from './trpc-panel.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TRPCModule.forRoot({
      autoSchemaFile: './src/@generated',
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [TrpcPanelController],
  providers: [AppService, AppRouter],
})
export class AppModule {}
