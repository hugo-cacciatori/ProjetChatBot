import { forwardRef, Module } from '@nestjs/common';
import { GeneratedRequestService } from './generated-request.service';
import { GeneratedRequestController } from './generated-request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeneratedRequest } from './entities/generated-request.entity';
import { LlmModule } from '../llm/llm.module';
import { QueueModule } from '../GlobalModules/queue/queue.module';
import { ProductModule } from '../product/product.module';
import { TagModule } from '../tag/tag.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GeneratedRequest]),
    LlmModule,
    forwardRef(() => QueueModule),
    forwardRef(() => ProductModule),
    TagModule,
  ],
  controllers: [GeneratedRequestController],
  providers: [GeneratedRequestService],
  exports: [GeneratedRequestService],
})
export class GeneratedRequestModule {}
