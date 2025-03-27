'use server';

import dbConnect from '@/lib/db';
import Subscribe from '@/app/models/Subscribe';
import { z } from 'zod';

// ✅ Define validation schema
const schema = z.object({
  email: z.string().email('Please enter a valid email'),
});

export async function subscribe(data: { email: string }) {
  await dbConnect();

  const validation = schema.safeParse(data);

  if (!validation.success) {
    return { error: 'Invalid email format' };
  }

  try {
    // Check if email already exists
    const exists = await Subscribe.findOne({ email: data.email });
    if (exists) {
      return { error: 'This email is already subscribed' };
    }

    // Create new subscription
    await Subscribe.create({ email: data.email });
    return { success: true, message: 'Subscription successful!' };
  } catch (error) {
    console.error('Subscription error:', error);
    return { error: 'Failed to subscribe. Please try again.' };
  }
}
