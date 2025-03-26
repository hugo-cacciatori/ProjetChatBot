import { Module } from '@nestjs/common';
import { GeneratedRequestService } from './generated-request.service';
import { GeneratedRequestController } from './generated-request.controller';

@Module({
  controllers: [GeneratedRequestController],
  providers: [GeneratedRequestService],
})
export class GeneratedRequestModule {}
