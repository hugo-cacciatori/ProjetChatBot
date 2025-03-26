import { Input, Mutation, Query, Router } from 'nestjs-trpc';
import { ExampleService } from './example.service';
import { z } from 'zod';

@Router()
export class ExampleRouter {
  constructor(private readonly exampleService: ExampleService) {}

  @Query({ output: z.string() })
  example(): string {
    return this.exampleService.example();
  }

  @Query({ output: z.string() })
  async asyncExample(): Promise<string> {
    return await this.exampleService.asyncExample();
  }

  @Query({ output: z.string() })
  sayHello(): string {
    return this.exampleService.getHello();
  }

  @Mutation({ input: z.object({ name: z.string() }) })
  setName(@Input('name') name: string): void {
    return this.exampleService.setName(name);
  }
}
