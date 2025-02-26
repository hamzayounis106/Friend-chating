import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/app/models/User';
import * as z from 'zod';
import { sendVerificationEmail } from '@/lib/sendVerificationEmail';
const resendSchema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { email } = resendSchema.parse(body);

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json('User not found', { status: 404 });
    }

    try {
      await sendVerificationEmail(user);
      return NextResponse.json('Verification email sent successfully', {
        status: 200,
      });
    } catch (error: any) {
      return NextResponse.json(error.message, { status: 500 });
    }
  } catch (error) {
    console.error('Resend verification error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json('Invalid request payload', { status: 422 });
    }
    return NextResponse.json('Something went wrong', { status: 500 });
  }
}
