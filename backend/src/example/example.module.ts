import { Module } from '@nestjs/common';
import { ExampleService } from './example.service';
import { ExampleRouter } from './example.router';

@Module({
  providers: [ExampleService, ExampleRouter],
})
export class ExampleModule {}
