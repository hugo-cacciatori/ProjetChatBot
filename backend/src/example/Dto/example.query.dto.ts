import { z } from 'zod';

export const SayHelloOutput = z.string();
export const ExampleOutput = z.string();
export const AsyncExampleOutput = z.string();

export const ExampleWithInputQueryInput = z.object({
  id: z.number().int(),
});

export const ExampleWithInputQueryOutput = z.string();
