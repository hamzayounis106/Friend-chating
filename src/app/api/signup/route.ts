import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/app/models/User';
import * as z from 'zod';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '@/lib/sendVerificationEmail';

const signupSchema = z.object({
  username: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['patient', 'surgeon']),
});

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();
    const { username, email, password, role } = signupSchema.parse(body);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json('User already exists', { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      name: username,
      email,
      password: hashedPassword,
      role,
      friends: [],
      image: '',
      emailVerified: null,
    });

    await newUser.save();

    try {
      await sendVerificationEmail(newUser);
      return NextResponse.json(
        'User created. Please check your email to verify your account.',
        { status: 201 }
      );
    } catch (error: any) {
      return NextResponse.json(error.message, { status: 500 });
    }
  } catch (error: any) {
    console.error('Signup error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json('Invalid request payload', { status: 422 });
    }
    return NextResponse.json('Something went wrong', { status: 500 });
  }
}
