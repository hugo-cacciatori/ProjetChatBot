import { forwardRef, Module } from '@nestjs/common';
import { GeneratedRequestService } from './generated-request.service';
import { GeneratedRequestController } from './generated-request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeneratedRequest } from './entities/generated-request.entity';
import { LlmModule } from '../llm/llm.module';
import { QueueModule } from '../GlobalModules/queue/queue.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GeneratedRequest]),
    LlmModule,
    forwardRef(() => QueueModule),
  ],
  controllers: [GeneratedRequestController],
  providers: [GeneratedRequestService],
  exports: [GeneratedRequestService],
})
export class GeneratedRequestModule {}
