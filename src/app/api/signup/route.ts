import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/app/models/User';
import * as z from 'zod';
import bcrypt from 'bcryptjs';

// Define the expected schema for the signup request.
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

    // Check if a user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json('User already exists', { status: 400 });
    }
    console.log('exisistin user ', existingUser);

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the new user. Note: You might want to set emailVerified to null,
    // friends to an empty array, and image to an empty string if not provided.
    const newUser = new User({
      name: username,
      email,
      password: hashedPassword,
      role,
      friends: [],
      image: '', // or set a default image URL if needed
      emailVerified: null,
    });

    await newUser.save();

    return NextResponse.json('User created successfully', { status: 201 });
  } catch (error: any) {
    console.error('Signup error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json('Invalid request payload', { status: 422 });
    }
    return NextResponse.json('Something went wrong', { status: 500 });
  }
}
