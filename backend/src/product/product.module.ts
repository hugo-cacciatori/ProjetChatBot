import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from './entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeneratedRequestModule } from '../generated-request/generated-request.module';
import { TagModule } from '../tag/tag.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    GeneratedRequestModule,
    TagModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
