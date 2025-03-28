import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppRouter } from './app.router';
import { TRPCModule } from 'nestjs-trpc';
import { TrpcPanelController } from './trpc-panel.controller';
import { ExampleModule } from './example/example.module';

@Module({
  imports: [
    TRPCModule.forRoot({
      autoSchemaFile: './src/@generated',
    }),
    ExampleModule,
  ],
  controllers: [TrpcPanelController],
  providers: [AppService, AppRouter],
})
export class AppModule {}
