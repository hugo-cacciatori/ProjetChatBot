import { Injectable } from '@nestjs/common';

@Injectable()
export class ExampleService {
  private name = 'World';

  example(): string {
    return 'This should be somewhat instant';
  }

  async asyncExample(): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => resolve('This took some time'), 2000);
    });
  }

  getHello(): string {
    return `Hello ${this.name}!`;
  }

  setName(name: string): void {
    this.name = name;
  }

  getSomethingById(id: number): string {
    return `You asked for item with ID: ${id}`;
  }
}
