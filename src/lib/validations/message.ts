// src/lib/validations/message.ts
import { z } from 'zod';

export const messageValidator = z.object({
  id: z.string(), // For the message id (converted from _id)
  sender: z.string(),
  receiver: z.string(),
  content: z.string(),
  timestamp: z.date(), // We'll use a Date here (if you're sending a Date) or you can use z.string() if it's already serialized.
});

export const messageArrayValidator = z.array(messageValidator);

export type Message = z.infer<typeof messageValidator>;
