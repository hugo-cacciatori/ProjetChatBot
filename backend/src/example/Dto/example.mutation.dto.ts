import { z } from 'zod';

export const SetNameInput = z.object({ name: z.string() });
