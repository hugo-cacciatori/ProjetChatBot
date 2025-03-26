import { Query, Router } from 'nestjs-trpc';
import { AppService } from './app.service';
import { z } from 'zod';

@Router()
export class AppRouter {
  constructor(private readonly appService: AppService) {}

  @Query({ output: z.string() })
  sayHello() {
    return this.appService.getHello();
  }
}
