
import { z } from 'zod';

export const SessionResponse = z.object({
  sessionId: z.string(),
  url: z.string().url().optional(),
  status: z.enum(['open', 'complete', 'expired']).optional()
});

export type SessionResponse = z.infer<typeof SessionResponse>;
