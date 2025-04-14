import { forwardRef, Global, Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { QueueController } from './queue.controller';
import { GeneratedRequestModule } from '../../generated-request/generated-request.module';

@Global()
@Module({
  imports: [forwardRef(() => GeneratedRequestModule)],
  controllers: [QueueController],
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule {}
