// src/lib/validations/message.ts
import { z } from 'zod';

export const messageValidator = z.object({
  id: z.string(),
  sender: z.string(),
  receiver: z.string(),
  content: z.string(),
  timestamp: z.date(),
});

export const extendedMessageValidator = messageValidator.extend({
  senderImg: z.string(),
  senderName: z.string(),
});

export const messageArrayValidator = z.array(messageValidator);

export type Message = z.infer<typeof messageValidator>;
export type ExtendedMessage = z.infer<typeof extendedMessageValidator>;
