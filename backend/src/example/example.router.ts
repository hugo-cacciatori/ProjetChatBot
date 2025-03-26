import { Input, Mutation, Query, Router } from 'nestjs-trpc';
import { ExampleService } from './example.service';
import * as QueryDto from './Dto/example.query.dto';
import * as MutationDto from './Dto/example.mutation.dto';

@Router()
export class ExampleRouter {
  constructor(private readonly exampleService: ExampleService) {}

  @Query({ output: QueryDto.ExampleOutput })
  example(): string {
    return this.exampleService.example();
  }

  @Query({ output: QueryDto.AsyncExampleOutput })
  async asyncExample(): Promise<string> {
    return await this.exampleService.asyncExample();
  }

  @Query({ output: QueryDto.SayHelloOutput })
  sayHello(): string {
    return this.exampleService.getHello();
  }

  @Query({
    input: QueryDto.ExampleWithInputQueryInput,
    output: QueryDto.ExampleWithInputQueryOutput,
  })
  getSomethingById(@Input('id') id: number): string {
    return this.exampleService.getSomethingById(id);
  }

  @Mutation({ input: MutationDto.SetNameInput })
  setName(@Input('name') name: string): void {
    return this.exampleService.setName(name);
  }
}
