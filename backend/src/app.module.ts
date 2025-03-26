import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppRouter } from './app.router';
import { TRPCModule } from 'nestjs-trpc';
import { TrpcPanelController } from './trpc-panel.controller';

@Module({
  imports: [
    TRPCModule.forRoot({
      autoSchemaFile: './src/@generated',
    }),
  ],
  controllers: [TrpcPanelController],
  providers: [AppService, AppRouter],
})
export class AppModule {}
