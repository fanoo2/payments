
import { z } from 'zod';

export const SessionRequest = z.object({
  amount: z.number().positive(),
  currency: z.string().min(3).max(3),
  customer_email: z.string().email().optional(),
  success_url: z.string().url().optional(),
  cancel_url: z.string().url().optional(),
  metadata: z.record(z.string()).optional()
});

export type SessionRequest = z.infer<typeof SessionRequest>;
