
import { z } from 'zod';

export const WebhookEvent = z.object({
  id: z.string(),
  type: z.string(),
  data: z.object({
    object: z.object({
      id: z.string()
    }).passthrough()
  }).passthrough(),
  created: z.number().optional(),
  livemode: z.boolean().optional()
});

export type WebhookEvent = z.infer<typeof WebhookEvent>;
